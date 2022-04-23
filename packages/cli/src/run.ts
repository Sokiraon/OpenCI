import { Project, Run } from "@openci/core";
import chalk from "chalk";
import Printer from "./printer";

export default async function run(
  projectName: string | undefined,
  options: Run.Options
) {
  if (projectName) {
    const project = Project.getByName(projectName);
    if (project) {
      await Run.startRemote(project.id, process.stdout, process.stderr, options);
    } else {
      Printer.error(`Failed to find specified project [${chalk.blue(projectName)}]`);
      process.exit(1);
    }
  } else {
    await Run.startLocal(process.cwd(), process.stdout, process.stderr, options);
  }
}
