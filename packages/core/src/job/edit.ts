import Database from "better-sqlite3";
import { DB_FILE } from "../constants.js";
import Job from "./index.js";

export function createJob(projectId: number) {
  const db = new Database(DB_FILE);
  const res = db
    .prepare(
      `
      INSERT INTO job_list VALUES (
        NULL, ${projectId}, 
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 
        ${Job.Status.Created}, '${Job.StatusTexts[Job.Status.Created]}',
        NULL
      )
    `
    )
    .run();
  db.close();
  return res.lastInsertRowid as number;
}

export function updateJobStatus(id: number, newStatus: Job.Status) {
  const db = new Database(DB_FILE);
  db.prepare(
    `
    UPDATE job_list SET
      updatedAt = CURRENT_TIMESTAMP,
      status = ${newStatus},
      statusText = '${Job.StatusTexts[newStatus]}'
    WHERE id = ${id}
  `
  ).run();
  db.close();
}

export function setJobLogPath(id: number, path: string) {
  const db = new Database(DB_FILE);
  db.prepare(
    `
    UPDATE job_list SET
      updatedAt = CURRENT_TIMESTAMP,
      logFilePath = '${path}'
    WHERE id = ${id}
  `
  ).run();
  db.close();
}
