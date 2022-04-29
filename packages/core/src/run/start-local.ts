import Run from ".";
import reporter from "./utils/reporter.js";
import { join } from "path";
import { prepareWorkspace } from "./utils/initialization.js";
import { VisitCommonStageResult, VisitStagesResult } from "../parser/visitor.js";
import parseCIFile from "../parser/index.js";
import { exit } from "process";
import chalk from "chalk";
import MessageStream from "./utils/message-stream";
import ExpressionRunner from "./utils/expr-runner.js";
import fs from "fs";
import lockfile from "proper-lockfile";

export default async function startLocalProject(
  path: string,
  options: Run.Options,
  messageStream: MessageStream.Duplex
) {
  reporter.init(path, messageStream);

  const cifilePath = join(path, "CIFile");
  let release: () => void;
  if (!fs.existsSync(cifilePath)) {
    reporter.error("Error, unable to find CIFile at project root!");
    exit(1);
  } else {
    try {
      release = lockfile.lockSync(cifilePath);
    } catch {
      reporter.error("Another job is running!");
      exit(1);
    }
  }
  await prepareWorkspace(path, options?.branch);

  let parseResult: VisitStagesResult;
  try {
    parseResult = parseCIFile(cifilePath);
  } catch (error) {
    if (error instanceof Error) {
      reporter.error(error.message);
    }
    exit(1);
  }

  const stagesToRun: VisitCommonStageResult[] = [];
  if (options && Array.isArray(options?.stages)) {
    for (const stage of options.stages) {
      const targetStage = parseResult.stages.find(element => element.name === stage);
      if (!targetStage) {
        reporter.error(`Error: cannot find specified stage [${chalk.blue(stage)}]`);
        exit(1);
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
  release();
  exit(0);
}
