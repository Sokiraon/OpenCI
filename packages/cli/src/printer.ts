import chalk from "chalk";
import figureSet from "figures";

export default class Printer {
  static #print(message: string, symbol: string) {
    if (message[0] === "\n") {
      console.log(`\n${symbol} ${message.slice(1)}`);
    } else {
      console.log(`${symbol} ${message}`);
    }
  }

  static success(message: string) {
    this.#print(message, chalk.green(figureSet.tick));
  }

  static info(message: string) {
    this.#print(message, chalk.blue(figureSet.info));
  }

  static warn(message: string) {
    this.#print(message, chalk.yellow(figureSet.warning));
  }

  static error(message: string) {
    this.#print(message, chalk.red(figureSet.cross));
  }
}
