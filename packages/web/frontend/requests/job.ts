import { Run } from "@openci/core";
import { get, post } from ".";

export const getJobLog = (id: number) => {
  return get<JobLog>(`/job/${id}/log`);
};

export const startJob = (data: { projectId: number; options?: Run.Options }) => {
  return post("/job/start", data);
};
