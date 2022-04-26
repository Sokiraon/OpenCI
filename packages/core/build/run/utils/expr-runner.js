var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import reporter from "./reporter.js";
import child_process from "child_process";
export default class ExpressionRunner {
    constructor(initialEnvs, messageStream) {
        this.globalEnvs = initialEnvs;
        this.stageEnvs = initialEnvs;
        this.messageStream = messageStream;
    }
    exec(commandDef) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                if (commandDef.type === "node") {
                    reporter.userCommand(`[node] ${commandDef.expression}`);
                    const output = String(Function(`return ${commandDef.expression}`)());
                    reporter.common(output);
                    resolve(output);
                }
                else {
                    let command = "";
                    switch (commandDef.type) {
                        case "echo":
                            command = `echo ${commandDef.expression}`;
                            break;
                        case "shell":
                            command = commandDef.expression;
                            break;
                        default:
                            break;
                    }
                    reporter.userCommand(command);
                    const process = child_process.spawn(command, {
                        shell: true,
                        env: this.stageEnvs,
                    });
                    let output = "";
                    process.stdout.setEncoding("utf-8");
                    process.stdout.on("data", (data) => {
                        output += data.trim();
                        reporter.common(data);
                    });
                    process.stderr.setEncoding("utf-8");
                    process.stderr.on("data", (data) => {
                        reporter.common(data);
                    });
                    process.on("close", code => {
                        if (code || code === null) {
                            reject(code !== null && code !== void 0 ? code : -1);
                        }
                        else {
                            resolve(output);
                        }
                    });
                }
            });
        });
    }
    genEnv(envDef) {
        return __awaiter(this, void 0, void 0, function* () {
            let value = "";
            if (typeof envDef.value === "string") {
                value = envDef.value;
            }
            else if ("expression" in envDef.value) {
                value = yield this.exec(envDef.value);
            }
            else {
                this.messageStream.write({
                    type: "inputReq",
                    content: envDef.value,
                });
                const message = yield this.messageStream.readNextMessage();
                if (message.type === "inputRes" && typeof message.content === "string") {
                    value = message.content;
                }
            }
            return value;
        });
    }
    setGlobalEnvs(envDefs) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const envDef of envDefs) {
                const value = yield this.genEnv(envDef);
                this.globalEnvs[envDef.name] = value;
            }
        });
    }
    setStageEnvs(envDefs) {
        return __awaiter(this, void 0, void 0, function* () {
            this.stageEnvs = Object.assign({}, this.globalEnvs);
            if (Array.isArray(envDefs)) {
                for (const envDef of envDefs) {
                    const value = yield this.genEnv(envDef);
                    this.stageEnvs[envDef.name] = value;
                }
            }
        });
    }
}
