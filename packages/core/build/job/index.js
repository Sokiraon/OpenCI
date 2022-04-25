import { createJob, setJobLogPath, updateJobStatus } from "./edit.js";
import QueryJob from "./query.js";
var Job;
(function (Job) {
    let Status;
    (function (Status) {
        Status[Status["Created"] = 0] = "Created";
        Status[Status["Cancelled"] = 1] = "Cancelled";
        Status[Status["FinishSuccess"] = 2] = "FinishSuccess";
        Status[Status["FinishError"] = 3] = "FinishError";
    })(Status = Job.Status || (Job.Status = {}));
    Job.StatusTexts = [
        "Running",
        "Cancelled",
        "Finished Successful",
        "Finished With Error",
    ];
    function create(projectId) {
        return createJob(projectId);
    }
    Job.create = create;
    function updateStatus(id, status) {
        return updateJobStatus(id, status);
    }
    Job.updateStatus = updateStatus;
    function setLogPath(id, path) {
        return setJobLogPath(id, path);
    }
    Job.setLogPath = setLogPath;
    function getById(jobId) {
        return QueryJob.getById(jobId);
    }
    Job.getById = getById;
    function getProjectJobs(projectId) {
        return QueryJob.getProjectJobs(projectId);
    }
    Job.getProjectJobs = getProjectJobs;
    function getJobDetail(id) {
        return QueryJob.getJobDetail(id);
    }
    Job.getJobDetail = getJobDetail;
})(Job || (Job = {}));
export default Job;
