import { Project, Job } from "@openci/core";
import { Injectable } from "@nestjs/common";
import { getErrorResponse, getOkResponse } from "../utils.js";

@Injectable()
export class ProjectsService {
  getAll() {
    const res: Array<{ info: Project.Record; jobs: Job.Record[] }> = [];
    const projects = Project.getAll();
    projects.forEach(project => {
      res.push({
        info: project,
        jobs: Job.getProjectJobs(project.id),
      });
    });
    return getOkResponse({ projects: res });
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
