import Run from ".";
import { DEFAULT_CIFILE } from "../constants.js";
import parseCIFile from "../parser/index.js";
import { VisitCommonStageResult, VisitStagesResult } from "../parser/visitor.js";
import Project from "../project/index.js";
import { prepareWorkspace } from "./utils/initialization.js";
import reporter from "./utils/reporter.js";
import chalk from "chalk";
import Job from "../job/index.js";
import MessageStream from "./utils/message-stream";
import ExpressionRunner from "./utils/expr-runner.js";

export default async function startRemoteProject(
  projectId: number,
  options: Run.Options,
  messageStream: MessageStream.Duplex
) {
  const project = Project.getById(projectId);
  if (!project) {
    messageStream.write({
      type: "error",
      content: "Failed to find specified project",
    });
    process.exit(1);
  }
  reporter.init(project, messageStream);
  await prepareWorkspace(project, options?.branch);
  let parseResult: VisitStagesResult;
  try {
    parseResult = parseCIFile(options?.input || DEFAULT_CIFILE);
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

  const exprRunner = new ExpressionRunner(process.env, messageStream);

  if (Array.isArray(parseResult.env)) {
    await exprRunner.setGlobalEnvs(parseResult.env);
  }
  for (const stage of stagesToRun) {
    reporter.info(`Begin running stage [${stage.name}]`);
    await exprRunner.setStageEnvs(stage.env);
    for (const step of stage.steps) {
      await exprRunner.exec(step);
    }
    reporter.success(`Finished running stage [${stage.name}]`);
  }
  reporter.success("Finished all the operations!");
  reporter.updateJobStatus(Job.Status.FinishSuccess);
  process.exit(0);
}
