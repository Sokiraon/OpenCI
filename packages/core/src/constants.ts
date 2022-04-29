import os from "os";
import { join } from "path";

export const ROOT_DIR = join(os.homedir(), "OpenCI");
export const DB_FILE = join(ROOT_DIR, "main.db");
export const LOG_DIR = join(ROOT_DIR, "CILogs");
export const WORKSPACE_DIR = join(ROOT_DIR, "workspace");
export const PLUGIN_DIR = join(ROOT_DIR, "plugins", "commands");

export default {
  ROOT_DIR,
  DB_FILE,
  LOG_DIR,
  WORKSPACE_DIR,
  PLUGIN_DIR,
};
