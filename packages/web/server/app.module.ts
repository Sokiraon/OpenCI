import { Module } from "@nestjs/common";
import { AppController } from "./app.controller.js";
import { AppService } from "./app.service.js";
import { ServeStaticModule } from "@nestjs/serve-static";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { ProjectsModule } from "./projects/projects.module.js";
import { JobModule } from "./job/job.module.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

@Module({
  imports: [
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, "..", "frontend"),
    // }),
    ProjectsModule,
    JobModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
