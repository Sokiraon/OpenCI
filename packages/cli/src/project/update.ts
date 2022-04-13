import Project from "@openci/core/build/project/index.js";
import chalk from "chalk";
import inquirer from "inquirer";
import { exit } from "process";
import Printer from "../printer.js";

const questions: inquirer.QuestionCollection<inquirer.Answers> = [
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

interface InquirerAnswers {
  description: string;
  src: string;
  defaultBranch: string;
}

export default async function update(projectName: string) {
  const coloredName = chalk.blue(projectName);
  const record = Project.getByName(projectName);
  if (record === undefined) {
    Printer.error(`Unable to find project [${coloredName}]`);
    exit(1);
  } else {
    Printer.info("Project To Be Updated:");
    console.log("------------------------");
    console.log(`Name: ${chalk.blue(record.name)}`);
    console.log(`Description: ${chalk.blue(record.description)}`);
    console.log(`Repo Src: ${chalk.blue(record.src)}`);
    console.log(`Default Branch: ${chalk.blue(record.defaultBranch)}`);
    console.log("------------------------");
    Printer.info("\nEnter the new configuration below:");

    const answers = (await inquirer.prompt(questions)) as InquirerAnswers;
    for (const [key, value] of Object.entries(answers)) {
      answers[key] = (value as string).trim();
    }
    try {
      Project.update({
        ...record,
        ...answers,
      });
      Printer.success(`\nSuccessfully updated project [${coloredName}]`);
    } catch {
      Printer.error(`\nFailed to update project [${coloredName}]`);
      exit(1);
    }
  }
}
