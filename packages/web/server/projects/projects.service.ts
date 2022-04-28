import { Project, Job } from "@openci/core";
import { Injectable } from "@nestjs/common";
import { getErrorResponse, getOkResponse } from "../utils.js";

@Injectable()
export class ProjectsService {
  getAll() {
    return getOkResponse(Project.getAll());
  }

  getProjectDetail(id: number) {
    const project = Project.getById(id);
    if (!project) {
      return getErrorResponse("Failed to find specified project");
    } else {
      const repoInfo = Project.listGitUrl(project.src);
      return getOkResponse({
        project,
        repoInfo,
        jobs: Job.getProjectJobs(id),
      });
    }
  }
}
