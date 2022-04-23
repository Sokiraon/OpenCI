declare namespace Job {
    enum Status {
        Created = 0,
        Cancelled = 1,
        FinishSuccess = 2,
        FinishError = 3
    }
    const StatusTexts: string[];
    interface Record {
        id: number;
        projectId: number;
        createdAt: string;
        updatedAt: string;
        status: Status;
        statusText: string;
        logFilePath?: string;
    }
    function create(projectId: number): number;
    function updateStatus(id: number, status: Status): void;
    function setLogPath(id: number, path: string): void;
    function getProjectJobs(projectId: number): Record[];
    function getJobLog(id: number): {
        fileName: string;
        content: string;
    } | undefined;
}
export default Job;
