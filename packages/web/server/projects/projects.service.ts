import { Project, Job } from "@openci/core";
import { Injectable } from "@nestjs/common";
import { getOkResponse } from "../utils.js";

@Injectable()
export class ProjectsService {
  getAll() {
    return getOkResponse(Project.getAll());
  }

  getProjectDetail(id: number) {
    return getOkResponse({
      project: Project.getById(id),
      jobs: Job.getProjectJobs(id),
    });
  }
}
