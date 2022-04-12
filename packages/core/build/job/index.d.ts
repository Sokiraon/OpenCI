declare namespace Job {
    type Record = {
        id: number;
        projectId: number;
        createdAt: string;
        updatedAt: string;
        status: number;
        statusText: string;
        logFilePath?: string;
    };
    function getProjectJobs(projectId: number): Record[];
    function getJobLog(id: number): {
        fileName: string;
        content: string;
    } | undefined;
}
export default Job;
