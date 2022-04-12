import Database from "better-sqlite3";
import { DB_FILE } from "../constants.js";
export default function createProject(data) {
    const db = new Database(DB_FILE);
    const runResult = db
        .prepare(`INSERT INTO project_list VALUES (
      NULL, '${data.name}', '${data.description}', '${data.src}', '${data.defaultBranch}'
    )`)
        .run();
    db.close();
    return Object.assign({ id: Number(runResult.lastInsertRowid) }, data);
}
