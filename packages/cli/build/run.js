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
import Printer from "./printer";
export default function run(projectName, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const messageStream = new MessageStream();
        messageStream.onMessageReceived = message => {
            if (message.type === "out") {
                process.stdout.write(message.content);
            }
            else {
                process.stderr.write(message.content);
            }
        };
        if (projectName) {
            const project = Project.getByName(projectName);
            if (project) {
                yield Run.startRemote(project.id, options, messageStream);
            }
            else {
                Printer.error(`Failed to find specified project [${chalk.blue(projectName)}]`);
                process.exit(1);
            }
        }
        else {
            yield Run.startLocal(process.cwd(), options, messageStream);
        }
    });
}
