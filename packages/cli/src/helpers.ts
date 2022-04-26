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

type InquirerAnswer = string[] | number[] | string | number | boolean;

export async function promptQuestion(question: {
  type: string;
  message: string;
}): Promise<InquirerAnswer> {
  const answers = await inquirer.prompt([
    {
      ...question,
      name: "value",
    },
  ]);
  return answers.value;
}
