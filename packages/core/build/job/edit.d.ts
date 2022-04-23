import Job from "./index.js";
export declare function createJob(projectId: number): number;
export declare function updateJobStatus(id: number, newStatus: Job.Status): void;
export declare function setJobLogPath(id: number, path: string): void;
