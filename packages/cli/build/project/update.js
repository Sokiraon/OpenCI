var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import chalk from "chalk";
import inquirer from "inquirer";
import { exit } from "process";
import { Project } from "@openci/core";
import Printer from "../printer.js";
const questions = [
    {
        type: "input",
        name: "description",
        message: "Enter project description:",
    },
    {
        type: "input",
        name: "src",
        message: "Enter your git remote url:",
    },
    {
        type: "input",
        name: "defaultBranch",
        message: "Enter a default work branch:",
    },
];
export default function update(projectName) {
    return __awaiter(this, void 0, void 0, function* () {
        const coloredName = chalk.blue(projectName);
        const record = Project.getByName(projectName);
        if (record === undefined) {
            Printer.error(`Unable to find project [${coloredName}]`);
            exit(1);
        }
        else {
            Printer.info("Project To Be Updated:");
            console.log("------------------------");
            console.log(`Name: ${chalk.blue(record.name)}`);
            console.log(`Description: ${chalk.blue(record.description)}`);
            console.log(`Repo Src: ${chalk.blue(record.src)}`);
            console.log(`Default Branch: ${chalk.blue(record.defaultBranch)}`);
            console.log("------------------------");
            Printer.info("\nEnter the new configuration below:");
            const answers = (yield inquirer.prompt(questions));
            for (const [key, value] of Object.entries(answers)) {
                answers[key] = value.trim();
            }
            try {
                Project.update(Object.assign(Object.assign({}, record), answers));
                Printer.success(`\nSuccessfully updated project [${coloredName}]`);
            }
            catch (_a) {
                Printer.error(`\nFailed to update project [${coloredName}]`);
                exit(1);
            }
        }
    });
}
