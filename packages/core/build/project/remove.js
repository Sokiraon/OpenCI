import Database from "better-sqlite3";
import { DB_FILE } from "../constants.js";
export default function removeProject(id) {
    const db = new Database(DB_FILE);
    db.prepare(`DELETE FROM project_list WHERE id = ${id}`).run();
    db.close();
}
