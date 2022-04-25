import Job from "./index.js";
export default class QueryJob {
    static getById(jobId: number): Job.Record | undefined;
    static getProjectJobs(projectId: number): Job.Record[];
    static getJobDetail(id: number): {
        info: Job.Record;
        log: {
            fileName: string;
            content: string;
            running: boolean;
        };
    } | undefined;
}
