var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { mkdirSync, writeFileSync } from "fs";
import path from "path";
import reporter from "./run/reporter";
import child_process from "child_process";
export function getDateStr() {
    return new Date().toISOString();
}
export function createFile(filePath) {
    const dirname = path.dirname(filePath);
    try {
        mkdirSync(dirname, { recursive: true });
        writeFileSync(filePath, "");
        return true;
    }
    catch (error) {
        return false;
    }
}
export function execSysCommand(command) {
    return __awaiter(this, void 0, void 0, function* () {
        reporter.sysCommand(command);
        const process = child_process.spawn(command, { shell: true });
        process.stdout.setEncoding("utf-8");
        process.stdout.on("data", (data) => {
            reporter.common(data);
        });
        process.stderr.setEncoding("utf-8");
        process.stderr.on("data", (data) => {
            reporter.error(data);
        });
        return new Promise((resolve, reject) => {
            process.on("close", code => {
                if (code || code === null) {
                    reject(code !== null && code !== void 0 ? code : -1);
                }
                else {
                    resolve(code);
                }
            });
        });
    });
}
