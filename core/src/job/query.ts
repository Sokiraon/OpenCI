import Database from "better-sqlite3";
import { DB_FILE } from "../constants.js";
import Job from "./index.js";
import fs from "fs";
import path from "path";

export default class QueryJob {
  static getProjectJobs(projectId: number) {
    const db = new Database(DB_FILE);
    const res = db
      .prepare(`SELECT * FROM job_list WHERE projectId = ${projectId}`)
      .all() as Job.Record[];
    db.close();
    return res;
  }

  static getJobLog(id: number) {
    const db = new Database(DB_FILE);
    const res = db
      .prepare(`SELECT logFilePath FROM job_list WHERE id = ${id}`)
      .get() as { logFilePath?: string } | undefined;
    if (res && res.logFilePath) {
      try {
        return {
          fileName: path.basename(res.logFilePath),
          content: fs.readFileSync(res.logFilePath, { encoding: "utf-8" })
        }
      } catch {
        return undefined;
      }
    }
    return undefined;
  }
}
