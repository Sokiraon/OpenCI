var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { exit } from "process";
import { execSysCommand } from "../helpers";
import reporter from "./reporter";
export function prepareWorkspace(branch) {
    return __awaiter(this, void 0, void 0, function* () {
        reporter.info("Preparing workspace...");
        if (branch) {
            const status = yield execSysCommand(`git fetch --all --prune && git reset --hard ${branch}`);
            if (status) {
                reporter.error("Failed to initialize the workspace");
                exit(status);
            }
        }
        reporter.success("Successfully initialized workspace!");
    });
}
