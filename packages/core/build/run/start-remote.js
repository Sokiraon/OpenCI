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
import ExprRunner from "./expr-runner.js";
import { prepareWorkspace } from "./initialization.js";
import reporter from "./reporter.js";
import chalk from "chalk";
import Job from "../job/index.js";
export default function startRemoteProject(projectId, out, err, options) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const project = Project.getById(projectId);
        if (!project) {
            err.write("Failed to find specified project");
            process.exit(1);
        }
        reporter.init(project, out, err);
        yield prepareWorkspace(project, options === null || options === void 0 ? void 0 : options.branch);
        let parseResult;
        try {
            parseResult = parseCIFile((_a = options === null || options === void 0 ? void 0 : options.input) !== null && _a !== void 0 ? _a : DEFAULT_CIFILE);
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
        if (Array.isArray(parseResult.env)) {
            yield ExprRunner.setGlobalEnvs(parseResult.env);
        }
        for (const stage of stagesToRun) {
            reporter.info(`Begin running stage [${stage.name}]`);
            yield ExprRunner.setStageEnvs(stage.env);
            for (const step of stage.steps) {
                yield ExprRunner.exec(step);
            }
            reporter.success(`Finished running stage [${stage.name}]`);
        }
        reporter.success("Finished all the operations!");
        reporter.updateJobStatus(Job.Status.FinishSuccess);
    });
}
