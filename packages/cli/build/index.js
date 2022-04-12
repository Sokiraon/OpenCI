#! /usr/bin/env node
import { Command } from "commander";
import projectCommand from "./project/index.js";
const program = new Command();
program
    .command("run [projectName]")
    .option("-i, --input <filePath>", "Specify a file as input", "./CIFile")
    .option("-b, --branch <workBranch>", "Specify a branch to work on")
    .option("-s, --stages [stages...]", "Choose specific stage(s) to run")
    .description("Run a CI task from current folder or a pre-configured project")
    .action((projectName, options) => {
});
program.addCommand(projectCommand);
program.version("0.1.0");
program.parse();
