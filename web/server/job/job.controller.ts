import { Controller, Get, Param } from "@nestjs/common";
import { JobService } from "./job.service.js";

@Controller("job")
export class JobController {
  constructor(private readonly jobService: JobService) {
    // do nothing
  }
    
  @Get(":id/log")
  getJobLog(@Param("id") id: number) {
    return this.jobService.getJobLog(id);
  }
}