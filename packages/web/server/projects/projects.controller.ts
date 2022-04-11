import { Controller, Get, Param } from "@nestjs/common";
import { ProjectsService } from "./projects.service.js";

@Controller("projects")
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {
    // do nothing
  }

  @Get()
  getAllProjects() {
    return this.projectsService.getAll();
  }

  @Get(":id/detail")
  getProjectDetail(@Param("id") id: number) {
    return this.projectsService.getProjectDetail(id);
  }
}
