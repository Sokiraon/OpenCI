import { Run } from "@openci/core";

export default async function run(projectName: string | undefined, options: Run.Options) {
  if (projectName) {
  } else {
    await Run.startLocal(process.cwd(), process.stdout, process.stderr, options);
  }
}
