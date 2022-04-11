import Database from "better-sqlite3";
import { DB_FILE } from "../constants.js";
import Project from "./index.js";

export function getAllProjects() {
  const db = new Database(DB_FILE);
  const res = db.prepare(`SELECT * FROM project_list`).all() as Project.Record[];
  db.close();
  return res;
}

export function queryProjectById(id: number) {
  const db = new Database(DB_FILE);
  let res: Project.Record | undefined;
  try {
    res = db.prepare(`SELECT * FROM project_list WHERE id = ${id}`).get();
  } catch {
    res = undefined;
  }
  db.close();
  return res;
}

export function queryProjectByName(name: string) {
  const db = new Database(DB_FILE);
  let res: Project.Record | undefined;
  try {
    res = db.prepare(`SELECT * FROM project_list WHERE name = '${name}'`).get();
  } catch {
    res = undefined;
  }
  db.close();
  return res;
}
