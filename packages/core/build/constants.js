import os from "os";
import { join } from "path";
export const ROOT_DIR = join(os.homedir(), "OpenCI");
export const DB_FILE = join(ROOT_DIR, "main.db");
