import { Command } from "commander";
import create from "./create.js";
import list from "./list.js";
import remove from "./remove.js";
import update from "./update.js";

const projectCommand = new Command("project")
  .description("Create, list, update or delete project configs")
  .alias("proj");

projectCommand
  .command("create")
  .alias("new")
  .description("Create a project for a remote source")
  .action(() => {
    create();
  });

projectCommand
  .command("list")
  .alias("ls")
  .description("List all of your configured projects")
  .option("-v, --verbose", "Show detailed info with src urls")
  .action(options => {
    list(options);
  });

projectCommand
  .command("update <project>")
  .alias("set")
  .description("Update project configuration")
  .action(project => {
    update(project);
  });

projectCommand
  .command("remove <projects...>")
  .alias("rm")
  .description("Remove projects specified by names")
  .option("-f, --force", "Force remove, ignore error and clean related data")
  .action((projects, options) => {
    remove(projects, options);
  });

export default projectCommand;
