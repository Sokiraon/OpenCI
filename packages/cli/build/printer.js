var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _a, _Printer_print;
import chalk from "chalk";
import figureSet from "figures";
export default class Printer {
    static success(message) {
        __classPrivateFieldGet(this, _a, "m", _Printer_print).call(this, message, chalk.green(figureSet.tick));
    }
    static info(message) {
        __classPrivateFieldGet(this, _a, "m", _Printer_print).call(this, message, chalk.blue(figureSet.info));
    }
    static warn(message) {
        __classPrivateFieldGet(this, _a, "m", _Printer_print).call(this, message, chalk.yellow(figureSet.warning));
    }
    static error(message) {
        __classPrivateFieldGet(this, _a, "m", _Printer_print).call(this, message, chalk.red(figureSet.cross));
    }
}
_a = Printer, _Printer_print = function _Printer_print(message, symbol) {
    if (message[0] === "\n") {
        console.log(`\n${symbol} ${message.slice(1)}`);
    }
    else {
        console.log(`${symbol} ${message}`);
    }
};
