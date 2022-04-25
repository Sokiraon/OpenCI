import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { Run } from "@openci/core";
import { JobService } from "./job.service.js";

@Controller("job")
export class JobController {
  constructor(private readonly jobService: JobService) {
    // do nothing
  }

  @Get("/:id/log")
  getJobLog(@Param("id") id: number) {
    return this.jobService.getJobLog(id);
  }

  @Post("/start")
  startJob(@Body("data") data: { projectId: number; options?: Run.Options }) {
    return this.jobService.startJob(data.projectId, data.options);
  }
}
