import { Injectable } from "@nestjs/common";
import Project from "@openci/core/build/project/index.js";
import { defaultOkResponse, getErrorResponse, getOkResponse } from "../utils.js";

@Injectable()
export class ProjectService {
  createProject(data: Project.Creation) {
    for (const [, value] of Object.entries(data)) {
      if (!value) {
        return getErrorResponse("Required fields are not filled");
      }
    }
    try {
      const record = Project.create(data);
      return getOkResponse({ record });
    } catch {
      return getErrorResponse("Failed to create project");
    }
  }

  updateProject(data: Project.Record) {
    for (const [, value] of Object.entries(data)) {
      if (!value) {
        return getErrorResponse("Required fields are not filled");
      }
    }
    try {
      Project.update(data);
      return defaultOkResponse;
    } catch {
      return getErrorResponse("Failed to update project");
    }
  }

  deleteProject(id: number) {
    Project.remove(id);
    return defaultOkResponse;
  }
}
