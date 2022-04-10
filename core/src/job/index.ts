import QueryJob from "./query.js";

namespace Job {
  export type Record = {
    id: number;
    projectId: number;
    createdAt: string;
    updatedAt: string;
    status: number;
    statusText: string;
    logFilePath?: string;
  };

  export function getProjectJobs(projectId: number): Record[] {
    return QueryJob.getProjectJobs(projectId);
  }

  export function getJobLog(id: number) {
    return QueryJob.getJobLog(id);
  }
}

export default Job;
