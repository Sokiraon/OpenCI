var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import reporter from "./utils/reporter.js";
import { join } from "path";
import { prepareWorkspace } from "./utils/initialization.js";
import { DEFAULT_CIFILE } from "../constants.js";
import parseCIFile from "../parser/index.js";
import { exit } from "process";
import chalk from "chalk";
import ExpressionRunner from "./utils/expr-runner.js";
export default function startLocalProject(path, options, messageStream) {
    return __awaiter(this, void 0, void 0, function* () {
        reporter.init(path, messageStream);
        yield prepareWorkspace(path, options === null || options === void 0 ? void 0 : options.branch);
        const filePath = join(path, (options === null || options === void 0 ? void 0 : options.input) || DEFAULT_CIFILE);
        let parseResult;
        try {
            parseResult = parseCIFile(filePath);
        }
        catch (error) {
            if (error instanceof Error) {
                reporter.error(error.message);
            }
            exit(1);
        }
        const stagesToRun = [];
        if (options && Array.isArray(options === null || options === void 0 ? void 0 : options.stages)) {
            for (const stage of options.stages) {
                const targetStage = parseResult.stages.find(element => element.name === stage);
                if (!targetStage) {
                    reporter.error(`Error: cannot find specified stage [${chalk.blue(stage)}]`);
                    exit(1);
                }
                else {
                    stagesToRun.push(targetStage);
                }
            }
        }
        else {
            stagesToRun.push(...parseResult.stages);
        }
        const exprRunner = new ExpressionRunner(process.env, messageStream);
        if (Array.isArray(parseResult.env)) {
            yield exprRunner.setGlobalEnvs(parseResult.env);
        }
        for (const stage of stagesToRun) {
            reporter.info(`Begin running stage [${stage.name}]`);
            yield exprRunner.setStageEnvs(stage.env);
            for (const step of stage.steps) {
                yield exprRunner.exec(step);
            }
            reporter.success(`Finished running stage [${stage.name}]`);
        }
        reporter.success("Finished all the operations!");
        process.exit(0);
    });
}
