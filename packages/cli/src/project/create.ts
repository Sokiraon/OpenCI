import Printer from "../printer.js";
import inquirer from "inquirer";
import chalk from "chalk";
import { Project } from "@openci/core";

const questions: inquirer.QuestionCollection<inquirer.Answers> = [
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

export default async function create() {
  Printer.info("Follow the guide below to create a new project.\n");
  const answers = (await inquirer.prompt(questions)) as Project.Creation;
  for (const [key, value] of Object.entries(answers)) {
    answers[key] = (value as string).trim();
  }
  const queriedProject = Project.getByName(answers.name);
  if (queriedProject) {
    Printer.error(`\nError, project [${chalk.blue(answers.name)}] already exists!`);
    process.exit(1);
  }
  const record = Project.create(answers);
  Printer.success(
    `\nSuccessfully created project [${chalk.blue(answers.name)}] (id: ${
      record.id
    })!`
  );
}
