import stream from "stream";
import Run from ".";
import { DEFAULT_CIFILE } from "../constants.js";
import parseCIFile from "../parser/index.js";
import { VisitCommonStageResult, VisitStagesResult } from "../parser/visitor.js";
import Project from "../project/index.js";
import ExprRunner from "./expr-runner.js";
import { prepareWorkspace } from "./initialization.js";
import reporter from "./reporter.js";
import chalk from "chalk";
import Job from "../job/index.js";

export default async function startRemoteProject(
  projectId: number,
  out: stream.Writable,
  err: stream.Writable,
  options?: Run.Options
) {
  const project = Project.getById(projectId);
  if (!project) {
    err.write("Failed to find specified project");
    process.exit(1);
  }
  reporter.init(project, out, err);
  await prepareWorkspace(project, options?.branch);
  let parseResult: VisitStagesResult;
  try {
    parseResult = parseCIFile(options?.input ?? DEFAULT_CIFILE);
  } catch (error) {
    if (error instanceof Error) {
      reporter.error(error.message);
    }
    process.exit(1);
  }

  const stagesToRun: VisitCommonStageResult[] = [];
  if (options && Array.isArray(options?.stages)) {
    for (const stage of options?.stages) {
      const targetStage = parseResult.stages.find(element => element.name === stage);
      if (!targetStage) {
        reporter.error(`Error: cannot find specified stage [${chalk.blue(stage)}]`);
        process.exit(1);
      } else {
        stagesToRun.push(targetStage);
      }
    }
  } else {
    stagesToRun.push(...parseResult.stages);
  }

  if (Array.isArray(parseResult.env)) {
    await ExprRunner.setGlobalEnvs(parseResult.env);
  }
  for (const stage of stagesToRun) {
    reporter.info(`Begin running stage [${stage.name}]`);
    await ExprRunner.setStageEnvs(stage.env);
    for (const step of stage.steps) {
      await ExprRunner.exec(step);
    }
    reporter.success(`Finished running stage [${stage.name}]`);
  }
  reporter.success("Finished all the operations!");
  reporter.updateJobStatus(Job.Status.FinishSuccess);
}
