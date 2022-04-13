import { get, post } from "./index";
import { Project, Job } from "@openci/core";

export const getProjectList = () => {
  return get<Project.Record[]>("/projects");
};

export const getProjectDetail = (id: number) => {
  return get<{ project: Project.Record; jobs: Job.Record[] }>(
    `/projects/${id}/detail`
  );
};

export const createProject = (data: Project.Creation) => {
  return post("/project/create", data);
};

export const updateProject = (data: Project.Creation) => {
  return post("/project/update", data);
};

export const deleteProject = (data: { id: number }) => {
  return post("/project/delete", data);
};

export const getJobList = (data: { id?: number }) => {
  return post<{ job_list: Job.Record[] }>("/project/job_list", data);
};
