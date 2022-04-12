import Database from "better-sqlite3";
import { DB_FILE } from "../constants.js";
export default function updateProject(data) {
    const db = new Database(DB_FILE);
    try {
        db.prepare(`UPDATE project_list SET
        name = '${data.name}',
        description = '${data.description}',
        src = '${data.src}',
        defaultBranch = '${data.defaultBranch}'
      WHERE id = ${data.id}`).run();
        db.close();
    }
    catch (error) {
        db.close();
        throw error;
    }
}
