var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Project, Run } from "@openci/core";
import MessageStream from "@openci/core/build/run/message-stream";
import chalk from "chalk";
import { promptQuestion } from "./helpers";
import Printer from "./printer";
export default function run(projectName, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const clientStream = new MessageStream.Duplex();
        const workerStream = new MessageStream.Duplex();
        MessageStream.connect(clientStream, workerStream);
        clientStream.onMessageReceived = message => {
            clientStream.messagesToHandle.shift();
            switch (message.type) {
                case "output":
                    process.stdout.write(message.content);
                    break;
                case "error":
                    process.stderr.write(message.content);
                    break;
                case "inputReq":
                    promptQuestion(message.content).then(res => {
                        let content = "";
                        if (Array.isArray(res)) {
                            content = res.map((item) => String(item)).join(":");
                        }
                        else {
                            content = String(res);
                        }
                        clientStream.write({
                            type: "inputRes",
                            content,
                        });
                    });
                    break;
                default:
                    break;
            }
        };
        if (projectName) {
            const project = Project.getByName(projectName);
            if (project) {
                yield Run.startRemote(project.id, options, workerStream);
            }
            else {
                Printer.error(`Failed to find specified project [${chalk.blue(projectName)}]`);
                process.exit(1);
            }
        }
        else {
            yield Run.startLocal(process.cwd(), options, workerStream);
        }
    });
}
