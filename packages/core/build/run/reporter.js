var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Reporter_instances, _Reporter_filePath, _Reporter_out, _Reporter_err, _Reporter_log;
import { exit } from "process";
import stream from "stream";
import { createFile, getDateStr } from "../helpers";
import chalk from "chalk";
import fs from "fs";
import figureSet from "figures";
class Reporter {
    constructor() {
        _Reporter_instances.add(this);
        _Reporter_filePath.set(this, "");
        _Reporter_out.set(this, new stream.Writable());
        _Reporter_err.set(this, new stream.Writable());
    }
    init(filePath, out, err = out) {
        __classPrivateFieldSet(this, _Reporter_filePath, filePath, "f");
        __classPrivateFieldSet(this, _Reporter_out, out, "f");
        __classPrivateFieldSet(this, _Reporter_err, err, "f");
        if (createFile(filePath) === false) {
            err.write(`Error: failed to create log file at ${filePath}`);
            exit(1);
        }
    }
    success(message) {
        __classPrivateFieldGet(this, _Reporter_instances, "m", _Reporter_log).call(this, `${message}\n`, figureSet.tick, chalk.green);
    }
    info(message) {
        __classPrivateFieldGet(this, _Reporter_instances, "m", _Reporter_log).call(this, `${message}\n`, figureSet.info, chalk.blue);
    }
    warn(message) {
        __classPrivateFieldGet(this, _Reporter_instances, "m", _Reporter_log).call(this, `${message}\n`, figureSet.warning, chalk.yellow);
    }
    error(message) {
        __classPrivateFieldGet(this, _Reporter_instances, "m", _Reporter_log).call(this, `${message}\n`, figureSet.cross, chalk.red);
    }
    sysCommand(message) {
        __classPrivateFieldGet(this, _Reporter_instances, "m", _Reporter_log).call(this, `${message}\n`, figureSet.arrowRight, chalk.magenta);
    }
    userCommand(message) {
        __classPrivateFieldGet(this, _Reporter_instances, "m", _Reporter_log).call(this, `${message}\n`, figureSet.pointerSmall, chalk.magenta);
    }
    common(message) {
        __classPrivateFieldGet(this, _Reporter_instances, "m", _Reporter_log).call(this, message);
    }
}
_Reporter_filePath = new WeakMap(), _Reporter_out = new WeakMap(), _Reporter_err = new WeakMap(), _Reporter_instances = new WeakSet(), _Reporter_log = function _Reporter_log(message, type, chalk, target = __classPrivateFieldGet(this, _Reporter_out, "f")) {
    const dateStr = getDateStr();
    if (type && chalk) {
        target.write(`[${dateStr}] ${chalk(type)} ${message}`);
        fs.appendFileSync(__classPrivateFieldGet(this, _Reporter_filePath, "f"), `[${dateStr}] ${type} ${message}`);
    }
    else {
        target.write(`[${dateStr}] ${message}`);
        fs.appendFileSync(__classPrivateFieldGet(this, _Reporter_filePath, "f"), `[${dateStr}] ${message}`);
    }
};
const reporter = new Reporter();
export default reporter;
