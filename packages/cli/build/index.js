#! /usr/bin/env node --experimental-specifier-resolution=node
import { Command } from "commander";
import projectCommand from "./project/index.js";
import run from "./run.js";
import { Constants } from "@openci/core";
import fs from "fs";
import path from "path";
const program = new Command();
program
    .command("run [projectName]")
    .option("-b, --branch <workBranch>", "Specify a branch to work on")
    .option("-s, --stages [stages...]", "Choose specific stage(s) to run")
    .description("Run a CI task from current folder or a pre-configured project")
    .action((projectName, options) => {
    run(projectName, options);
});
program.addCommand(projectCommand);
if (fs.existsSync(Constants.PLUGIN_DIR)) {
    fs.readdirSync(Constants.PLUGIN_DIR).forEach(file => {
        const filePath = path.join(Constants.PLUGIN_DIR, file);
        if (fs.lstatSync(filePath).isDirectory()) {
            let commandName = file;
            let description = "";
            const infoFile = path.join(filePath, "info.json");
            if (fs.existsSync(infoFile)) {
                try {
                    const info = JSON.parse(fs.readFileSync(infoFile, { encoding: "utf-8" }));
                    if (info.name) {
                        commandName = info.name;
                    }
                    if (info.description) {
                        description = info.description;
                    }
                }
                catch (_a) { }
            }
            program.command(commandName, description, {
                executableFile: path.join(filePath, "index.js"),
            });
        }
    });
}
program.version("0.1.0");
program.parse();
