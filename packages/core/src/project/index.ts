import createProject from "./create.js";
import { getAllProjects, queryProjectById, queryProjectByName } from "./query.js";
import removeProject from "./remove.js";

namespace Project {
  export type Creation = {
    name: string;
    description: string;
    src: string;
    defaultBranch: string;
  };

  export type Record = Creation & { id: number };

  export function create(data: Creation) {
    return createProject(data);
  }

  export function getAll(): Record[] {
    return getAllProjects();
  }

  export function getById(id: number): Record | undefined {
    return queryProjectById(id);
  }

  export function getByName(name: string): Record | undefined {
    return queryProjectByName(name);
  }

  export function remove(id: number) {
    return removeProject(id);
  }
}

export default Project;
