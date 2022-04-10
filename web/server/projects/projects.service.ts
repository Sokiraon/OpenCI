import { Injectable } from "@nestjs/common";
import CoreModules from "@openci/core";
import { getOkResponse } from "../utils.js";

@Injectable()
export class ProjectsService {
  getAll() {
    return getOkResponse(CoreModules.Project.getAll());
  }

  getProjectDetail(id: number) {
    return getOkResponse({
      project: CoreModules.Project.getById(id),
      jobs: CoreModules.Job.getProjectJobs(id),
    });
  }
}
