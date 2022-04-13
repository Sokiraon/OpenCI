import { mkdirSync, writeFileSync } from "fs";
import path from "path";
import reporter from "./run/reporter";
import child_process from "child_process";

export function getDateStr() {
  return new Date().toISOString();
}

export function createFile(filePath: string) {
  const dirname = path.dirname(filePath);
  try {
    mkdirSync(dirname, { recursive: true });
    writeFileSync(filePath, "");
    return true;
  } catch (error) {
    return false;
  }
}

export async function execSysCommand(command: string): Promise<number> {
  reporter.sysCommand(command);
  const process = child_process.spawn(command, { shell: true });

  process.stdout.setEncoding("utf-8");
  process.stdout.on("data", (data: string) => {
    reporter.common(data);
  });

  process.stderr.setEncoding("utf-8");
  process.stderr.on("data", (data: string) => {
    reporter.error(data);
  });

  return new Promise((resolve, reject) => {
    process.on("close", code => {
      if (code || code === null) {
        reject(code ?? -1);
      } else {
        resolve(code);
      }
    });
  });
}
