import QueryJob from "./query.js";
var Job;
(function (Job) {
    function getProjectJobs(projectId) {
        return QueryJob.getProjectJobs(projectId);
    }
    Job.getProjectJobs = getProjectJobs;
    function getJobLog(id) {
        return QueryJob.getJobLog(id);
    }
    Job.getJobLog = getJobLog;
})(Job || (Job = {}));
export default Job;
