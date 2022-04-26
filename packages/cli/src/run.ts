import { Project, Run } from "@openci/core";
import MessageStream from "@openci/core/build/run/message-stream";
import chalk from "chalk";
import inquirer from "inquirer";
import { promptQuestion } from "./helpers";
import Printer from "./printer";

export default async function run(
  projectName: string | undefined,
  options: Run.Options
) {
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
          clientStream.write({
            type: "inputRes",
            content: res,
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
      await Run.startRemote(project.id, options, workerStream);
    } else {
      Printer.error(`Failed to find specified project [${chalk.blue(projectName)}]`);
      process.exit(1);
    }
  } else {
    await Run.startLocal(process.cwd(), options, workerStream);
  }
}
