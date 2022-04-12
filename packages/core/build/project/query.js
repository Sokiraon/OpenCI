import Database from "better-sqlite3";
import { DB_FILE } from "../constants.js";
export function getAllProjects() {
    const db = new Database(DB_FILE);
    const res = db.prepare(`SELECT * FROM project_list`).all();
    db.close();
    return res;
}
export function queryProjectById(id) {
    const db = new Database(DB_FILE);
    let res;
    try {
        res = db.prepare(`SELECT * FROM project_list WHERE id = ${id}`).get();
    }
    catch (_a) {
        res = undefined;
    }
    db.close();
    return res;
}
export function queryProjectByName(name) {
    const db = new Database(DB_FILE);
    let res;
    try {
        res = db.prepare(`SELECT * FROM project_list WHERE name = '${name}'`).get();
    }
    catch (_a) {
        res = undefined;
    }
    db.close();
    return res;
}
