import { Module } from "@nestjs/common";
import { ProjectController } from "./project.controller.js";
import { ProjectService } from "./project.service.js";

@Module({
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
