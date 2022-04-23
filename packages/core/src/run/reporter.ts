import { exit } from "process";
import stream from "stream";
import { createFile, getDateStr } from "../helpers.js";
import chalk, { ChalkInstance } from "chalk";
import fs from "fs";
import figureSet from "figures";
import { join } from "path";
import Project from "../project/index.js";
import Job from "../job/index.js";
import { LOG_DIR } from "../constants.js";

class Reporter {
  #filePath: string = "";
  #jobId?: number;
  #out: stream.Writable = new stream.Writable();
  #err: stream.Writable = new stream.Writable();

  init(
    pathSpecifier: string | Project.Record,
    out: stream.Writable,
    err: stream.Writable = out
  ) {
    let filePath = "";
    if (typeof pathSpecifier === "string") {
      filePath = join(pathSpecifier, "CILogs", `job_log-${getDateStr()}.log`);
    } else {
      this.#jobId = Job.create(pathSpecifier.id);
      filePath = join(
        LOG_DIR,
        pathSpecifier.name,
        `job_log-${pathSpecifier.name}-${this.#jobId}-${getDateStr()}.log`
      );
      Job.setLogPath(this.#jobId, filePath);
    }
    this.#filePath = filePath;
    this.#out = out;
    this.#err = err;
    if (createFile(filePath) === false) {
      err.write(`Error: failed to create log file at ${filePath}`);
      exit(1);
    }
  }

  updateJobStatus(newStatus: Job.Status) {
    if (this.#jobId) {
      Job.updateStatus(this.#jobId, newStatus);
    }
  }

  #log(
    message: string,
    type?: string,
    chalk?: ChalkInstance,
    target: stream.Writable = this.#out
  ) {
    if (message.endsWith("\n")) {
      message = message.slice(0, -1);
    }
    const messageList = message.split("\n");

    for (let message of messageList) {
      message += "\n";
      const dateStr = getDateStr();

      if (type && chalk) {
        target.write(`[${dateStr}] ${chalk(type)} ${message}`);
        fs.appendFileSync(this.#filePath, `[${dateStr}] ${type} ${message}`);
      } else {
        target.write(`[${dateStr}] ${message}`);
        fs.appendFileSync(this.#filePath, `[${dateStr}] ${message}`);
      }
    }
  }

  success(message: string) {
    this.#log(message, figureSet.tick, chalk.green);
  }

  info(message: string) {
    this.#log(message, figureSet.info, chalk.blue);
  }

  warn(message: string) {
    this.#log(message, figureSet.warning, chalk.yellow);
  }

  error(message: string) {
    this.#log(message, figureSet.cross, chalk.red, this.#err);
    this.updateJobStatus(Job.Status.FinishError);
  }

  sysCommand(message: string) {
    this.#log(message, figureSet.arrowRight, chalk.magenta);
  }

  userCommand(message: string) {
    this.#log(message, figureSet.pointerSmall, chalk.magenta);
  }

  common(message: string) {
    this.#log(message);
  }
}

const reporter = new Reporter();

export default reporter;
