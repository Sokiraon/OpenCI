import { join } from "path";
import { WORKSPACE_DIR } from "../../constants.js";
import { execSysCommand } from "../../helpers.js";
import Project from "../../project/index.js";
import reporter from "./reporter.js";
import fs from "fs";

export async function prepareWorkspace(
  pathSpecifier: string | Project.Record,
  branch?: string
) {
  reporter.info("Preparing workspace...");
  if (typeof pathSpecifier === "string") {
    process.chdir(pathSpecifier);
    if (branch) {
      try {
        await execSysCommand(
          `git fetch --all --prune && git reset --hard ${branch}`
        );
      } catch {
        reporter.error("Failed to initialize the workspace");
        process.exit(1);
      }
    }
  } else {
    // "branch" specified by run option has higher priority than that of project config
    branch ||= pathSpecifier.defaultBranch;
    const workDir = join(WORKSPACE_DIR, pathSpecifier.name);
    if (fs.existsSync(workDir)) {
      reporter.sysCommand(`cd ${workDir}`);
      process.chdir(workDir);
      try {
        await execSysCommand(
          `git fetch --all --prune && git reset --hard origin/${branch}`
        );
      } catch {
        reporter.error("Failed to initialize the workspace");
        process.exit(1);
      }
    } else {
      fs.mkdirSync(WORKSPACE_DIR, { recursive: true });
      reporter.sysCommand(`cd ${WORKSPACE_DIR}`);
      process.chdir(WORKSPACE_DIR);
      try {
        await execSysCommand(
          `git clone -b ${branch} --single-branch ${pathSpecifier.src} ${pathSpecifier.name}`
        );
        reporter.sysCommand(`cd ${pathSpecifier.name}`);
        process.chdir(workDir);
      } catch {
        reporter.error("Failed to initialize the workspace");
        process.exit(1);
      }
    }
  }
  reporter.success("Successfully initialized workspace!");
}
