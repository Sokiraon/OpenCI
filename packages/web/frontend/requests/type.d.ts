import { Project, Job } from "@openci/core";

interface RepoInfo {
  branches: string[];
  tags: string[];
}

type ProjectList = {
  info: Project.Record;
  jobs: Job.Record[];
}[];

interface ProjectDetail {
  project: Project.Record;
  repoInfo: RepoInfo;
  jobs: Job.Record[];
}
