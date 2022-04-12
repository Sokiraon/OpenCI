import { Body, Controller, Post } from "@nestjs/common";
import Project from "@openci/core/build/project/index.js";
import { ProjectService } from "./project.service.js";

@Controller("project")
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {
    // do nothing
  }

  @Post("create")
  createProject(@Body("data") data: Project.Creation) {
    return this.projectService.createProject(data);
  }

  @Post("update")
  updateProject(@Body("data") data: Project.Record) {
    return this.projectService.updateProject(data);
  }

  @Post("delete")
  deleteProject(@Body("data") data: { id: number }) {
    return this.projectService.deleteProject(data.id);
  }
}
