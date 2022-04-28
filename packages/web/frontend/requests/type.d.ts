import { Project, Job } from "@openci/core";

interface RepoInfo {
  branches: string[];
  tags: string[];
}

interface ProjectDetail {
  project: Project.Record;
  repoInfo: RepoInfo;
  jobs: Job.Record[];
}
