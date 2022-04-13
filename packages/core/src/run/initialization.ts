import { exit } from "process";
import { execSysCommand } from "../helpers";
import reporter from "./reporter";

export async function prepareWorkspace(branch?: string) {
  reporter.info("Preparing workspace...");
  if (branch) {
    const status = await execSysCommand(
      `git fetch --all --prune && git reset --hard ${branch}`
    );
    if (status) {
      reporter.error("Failed to initialize the workspace");
      exit(status);
    }
  }
  reporter.success("Successfully initialized workspace!");
}
