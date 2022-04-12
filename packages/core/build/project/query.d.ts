import Project from "./index.js";
export declare function getAllProjects(): Project.Record[];
export declare function queryProjectById(id: number): Project.Record | undefined;
export declare function queryProjectByName(name: string): Project.Record | undefined;
