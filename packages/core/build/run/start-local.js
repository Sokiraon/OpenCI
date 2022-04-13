var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import reporter from "./reporter";
import { join } from "path";
import { getDateStr } from "../helpers";
import { prepareWorkspace } from "./initialization";
export default function startLocalProject(path, out, err, options) {
    return __awaiter(this, void 0, void 0, function* () {
        reporter.init(join(path, "CILogs", `job_log-${getDateStr()}.log`), out, err);
        yield prepareWorkspace(options === null || options === void 0 ? void 0 : options.branch);
    });
}
