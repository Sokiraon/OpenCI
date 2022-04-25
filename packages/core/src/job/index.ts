import { createJob, setJobLogPath, updateJobStatus } from "./edit.js";
import QueryJob from "./query.js";

namespace Job {
  export enum Status {
    Created = 0,
    Cancelled,
    FinishSuccess,
    FinishError,
  }

  export const StatusTexts = [
    "Running",
    "Cancelled",
    "Finished Successful",
    "Finished With Error",
  ];

  export interface Record {
    id: number;
    projectId: number;
    createdAt: string;
    updatedAt: string;
    status: Status;
    statusText: string;
    logFilePath?: string;
  }

  export function create(projectId: number) {
    return createJob(projectId);
  }

  export function updateStatus(id: number, status: Status) {
    return updateJobStatus(id, status);
  }

  export function setLogPath(id: number, path: string) {
    return setJobLogPath(id, path);
  }

  export function getById(jobId: number): Record | undefined {
    return QueryJob.getById(jobId);
  }

  export function getProjectJobs(projectId: number): Record[] {
    return QueryJob.getProjectJobs(projectId);
  }

  export function getJobDetail(id: number) {
    return QueryJob.getJobDetail(id);
  }
}

export default Job;
