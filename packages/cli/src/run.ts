import { Project, Run } from "@openci/core";
import MessageStream from "@openci/core/build/run/message-stream";
import chalk from "chalk";
import Printer from "./printer";

export default async function run(
  projectName: string | undefined,
  options: Run.Options
) {
  const messageStream = new MessageStream();
  messageStream.onMessageReceived = message => {
    if (message.type === "out") {
      process.stdout.write(message.content);
    } else {
      process.stderr.write(message.content);
    }
  };
  if (projectName) {
    const project = Project.getByName(projectName);
    if (project) {
      await Run.startRemote(project.id, options, messageStream);
    } else {
      Printer.error(`Failed to find specified project [${chalk.blue(projectName)}]`);
      process.exit(1);
    }
  } else {
    await Run.startLocal(process.cwd(), options, messageStream);
  }
}
