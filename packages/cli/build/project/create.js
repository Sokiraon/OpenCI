var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Printer from "../printer.js";
import inquirer from "inquirer";
import chalk from "chalk";
import { Project } from "@openci/core";
const questions = [
    {
        type: "input",
        name: "name",
        message: "Enter the project name:",
    },
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
export default function create() {
    return __awaiter(this, void 0, void 0, function* () {
        Printer.info("Follow the guide below to create a new project.\n");
        const answers = (yield inquirer.prompt(questions));
        for (const [key, value] of Object.entries(answers)) {
            answers[key] = value.trim();
        }
        const queriedProject = Project.getByName(answers.name);
        if (queriedProject) {
            Printer.error(`\nError, project [${chalk.blue(answers.name)}] already exists!`);
            process.exit(1);
        }
        const record = Project.create(answers);
        Printer.success(`\nSuccessfully created project [${chalk.blue(answers.name)}] (id: ${record.id})!`);
    });
}
