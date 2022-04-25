import { Job, Run } from "@openci/core";
import { get, post } from ".";

export interface JobDetail {
  info: Job.Record;
  log: {
    fileName: string;
    content: string;
    running: boolean;
  };
}

export const getJobDetail = (id: number) => {
  return get<JobDetail>(`/job/${id}/detail`);
};

export const startJob = (data: { projectId: number; options?: Run.Options }) => {
  return post("/job/start", data);
};
