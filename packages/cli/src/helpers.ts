import inquirer from "inquirer";

export async function promptConfirm(message: string): Promise<boolean> {
  const answers = await inquirer.prompt({
    type: "confirm",
    name: "confirm",
    message: message,
    default: false,
  });
  return answers.confirm;
}