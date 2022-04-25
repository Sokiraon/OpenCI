import { exit } from "process";
import { createFile, getDateStr } from "../helpers.js";
import chalk, { ChalkInstance } from "chalk";
import fs from "fs";
import figureSet from "figures";
import { join } from "path";
import Project from "../project/index.js";
import Job from "../job/index.js";
import { LOG_DIR } from "../constants.js";
import MessageStream from "./message-stream.js";

class Reporter {
  #filePath: string = "";
  #jobId?: number;
  #stream?: MessageStream;

  init(pathSpecifier: string | Project.Record, stream?: MessageStream) {
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
    this.#stream = stream;
    if (createFile(filePath) === false) {
      stream?.send({
        type: "err",
        content: `Error: failed to create log file at ${filePath}`,
      });
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
    streamType: "err" | "out" = "out"
  ) {
    if (message.endsWith("\n")) {
      message = message.slice(0, -1);
    }
    const messageList = message.split("\n");

    for (let message of messageList) {
      message += "\n";
      const dateStr = getDateStr();

      if (type && chalk) {
        this.#stream?.send({
          type: streamType,
          content: `[${dateStr}] ${chalk(type)} ${message}`,
        });
        fs.appendFileSync(this.#filePath, `[${dateStr}] ${type} ${message}`);
      } else {
        this.#stream?.send({
          type: streamType,
          content: `[${dateStr}] ${message}`,
        });
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
    this.#log(message, figureSet.cross, chalk.red, "err");
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
