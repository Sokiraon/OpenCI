import { exit } from "process";
import stream from "stream";
import { createFile, getDateStr } from "../helpers";
import chalk, { ChalkInstance } from "chalk";
import fs from "fs";
import figureSet from "figures";

class Reporter {
  #filePath: string = "";
  #out: stream.Writable = new stream.Writable();
  #err: stream.Writable = new stream.Writable();

  init(filePath: string, out: stream.Writable, err: stream.Writable = out) {
    this.#filePath = filePath;
    this.#out = out;
    this.#err = err;
    if (createFile(filePath) === false) {
      err.write(`Error: failed to create log file at ${filePath}`);
      exit(1);
    }
  }

  #log(
    message: string,
    type?: string,
    chalk?: ChalkInstance,
    target: stream.Writable = this.#out
  ) {
    const dateStr = getDateStr();
    if (type && chalk) {
      target.write(`[${dateStr}] ${chalk(type)} ${message}`);
      fs.appendFileSync(this.#filePath, `[${dateStr}] ${type} ${message}`);
    } else {
      target.write(`[${dateStr}] ${message}`);
      fs.appendFileSync(this.#filePath, `[${dateStr}] ${message}`);
    }
  }

  success(message: string) {
    this.#log(`${message}\n`, figureSet.tick, chalk.green);
  }

  info(message: string) {
    this.#log(`${message}\n`, figureSet.info, chalk.blue);
  }

  warn(message: string) {
    this.#log(`${message}\n`, figureSet.warning, chalk.yellow);
  }

  error(message: string) {
    this.#log(`${message}\n`, figureSet.cross, chalk.red);
  }

  sysCommand(message: string) {
    this.#log(`${message}\n`, figureSet.arrowRight, chalk.magenta);
  }

  userCommand(message: string) {
    this.#log(`${message}\n`, figureSet.pointerSmall, chalk.magenta);
  }

  common(message: string) {
    this.#log(message);
  }
}

const reporter = new Reporter();

export default reporter;
