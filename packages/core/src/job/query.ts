import Database from "better-sqlite3";
import { DB_FILE } from "../constants.js";
import Job from "./index.js";
import fs from "fs";
import path from "path";

export default class QueryJob {
  static getById(jobId: number) {
    const db = new Database(DB_FILE);
    const res: Job.Record | undefined = db
      .prepare(`SELECT * FROM job_list WHERE id = ${jobId}`)
      .get();
    db.close();
    return res;
  }

  static getProjectJobs(projectId: number) {
    const db = new Database(DB_FILE);
    const res = db
      .prepare(`SELECT * FROM job_list WHERE projectId = ${projectId}`)
      .all() as Job.Record[];
    db.close();
    return res;
  }

  static getJobDetail(id: number) {
    const job = this.getById(id);
    if (job && job.logFilePath) {
      try {
        return {
          info: job,
          log: {
            fileName: path.basename(job.logFilePath),
            content: fs.readFileSync(job.logFilePath, { encoding: "utf-8" }),
            running: job.status === Job.Status.Created,
          },
        };
      } catch {
        return undefined;
      }
    }
    return undefined;
  }
}
