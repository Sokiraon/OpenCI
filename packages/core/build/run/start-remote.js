var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DEFAULT_CIFILE } from "../constants.js";
import parseCIFile from "../parser/index.js";
import Project from "../project/index.js";
import { prepareWorkspace } from "./utils/initialization.js";
import reporter from "./utils/reporter.js";
import chalk from "chalk";
import Job from "../job/index.js";
import ExpressionRunner from "./utils/expr-runner.js";
export default function startRemoteProject(projectId, options, messageStream) {
    return __awaiter(this, void 0, void 0, function* () {
        const project = Project.getById(projectId);
        if (!project) {
            messageStream.write({
                type: "error",
                content: "Failed to find specified project",
            });
            process.exit(1);
        }
        reporter.init(project, messageStream);
        yield prepareWorkspace(project, options === null || options === void 0 ? void 0 : options.branch);
        let parseResult;
        try {
            parseResult = parseCIFile((options === null || options === void 0 ? void 0 : options.input) || DEFAULT_CIFILE);
        }
        catch (error) {
            if (error instanceof Error) {
                reporter.error(error.message);
            }
            process.exit(1);
        }
        const stagesToRun = [];
        if (options && Array.isArray(options === null || options === void 0 ? void 0 : options.stages)) {
            for (const stage of options === null || options === void 0 ? void 0 : options.stages) {
                const targetStage = parseResult.stages.find(element => element.name === stage);
                if (!targetStage) {
                    reporter.error(`Error: cannot find specified stage [${chalk.blue(stage)}]`);
                    process.exit(1);
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
        reporter.updateJobStatus(Job.Status.FinishSuccess);
        process.exit(0);
    });
}
