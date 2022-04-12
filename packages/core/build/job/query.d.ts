import Job from "./index.js";
export default class QueryJob {
    static getProjectJobs(projectId: number): Job.Record[];
    static getJobLog(id: number): {
        fileName: string;
        content: string;
    } | undefined;
}
