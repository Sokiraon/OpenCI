var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { join } from "path";
import { WORKSPACE_DIR } from "../constants.js";
import { execSysCommand } from "../helpers.js";
import reporter from "./reporter.js";
import fs from "fs";
export function prepareWorkspace(pathSpecifier, branch) {
    return __awaiter(this, void 0, void 0, function* () {
        reporter.info("Preparing workspace...");
        if (typeof pathSpecifier === "string") {
            process.chdir(pathSpecifier);
            if (branch) {
                try {
                    yield execSysCommand(`git fetch --all --prune && git reset --hard ${branch}`);
                }
                catch (_a) {
                    reporter.error("Failed to initialize the workspace");
                    process.exit(1);
                }
            }
        }
        else {
            branch || (branch = pathSpecifier.defaultBranch);
            const workDir = join(WORKSPACE_DIR, pathSpecifier.name);
            if (fs.existsSync(workDir)) {
                reporter.sysCommand(`cd ${workDir}`);
                process.chdir(workDir);
                try {
                    yield execSysCommand(`git fetch --all --prune && git reset --hard origin/${branch}`);
                }
                catch (_b) {
                    reporter.error("Failed to initialize the workspace");
                    process.exit(1);
                }
            }
            else {
                fs.mkdirSync(WORKSPACE_DIR, { recursive: true });
                reporter.sysCommand(`cd ${WORKSPACE_DIR}`);
                process.chdir(WORKSPACE_DIR);
                try {
                    yield execSysCommand(`git clone -b ${branch} --single-branch ${pathSpecifier.src} ${pathSpecifier.name}`);
                    reporter.sysCommand(`cd ${pathSpecifier.name}`);
                    process.chdir(workDir);
                }
                catch (_c) {
                    reporter.error("Failed to initialize the workspace");
                    process.exit(1);
                }
            }
        }
        reporter.success("Successfully initialized workspace!");
    });
}
