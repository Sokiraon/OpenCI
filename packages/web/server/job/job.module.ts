import { Module } from "@nestjs/common";
import { JobController } from "./job.controller.js";
import { JobService } from "./job.service.js";

@Module({
  controllers: [JobController],
  providers: [JobService],
})
export class JobModule {}
