import chalk from "chalk";
import { Project } from "@openci/core";
import { promptConfirm } from "../helpers.js";
import Printer from "../printer.js";

interface RemoveOptions {
  force?: boolean;
}

export default async function remove(
  projectNames: string[],
  options: RemoveOptions
) {
  for (const projectName of projectNames) {
    const coloredName = chalk.blue(projectName);
    const record = Project.getByName(projectName);
    if (record === undefined) {
      Printer.error(`Unable to find project [${coloredName}]\n`);
    } else {
      if (!options.force) {
        Printer.info("Project To Be Removed:");
        console.log("------------------------");
        console.log(`Name: ${chalk.blue(record.name)}`);
        console.log(`Description: ${chalk.blue(record.description)}`);
        console.log(`Repo Src: ${chalk.blue(record.src)}`);
        console.log(`Default Branch: ${chalk.blue(record.defaultBranch)}`);
        console.log("------------------------");
        if ((await promptConfirm("Are you sure to remove it?")) === false) {
          Printer.info("Operation cancelled, heading to next...\n");
          continue;
        }
      }
      Project.remove(record.id);
      Printer.success(`Successfully removed project [${projectName}]\n`);
    }
  }
  Printer.success("Finished all the operations!");
}
