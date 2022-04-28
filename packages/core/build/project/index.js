import createProject from "./create.js";
import { getAllProjects, queryProjectById, queryProjectByName } from "./query.js";
import removeProject from "./remove.js";
import updateProject from "./update.js";
import { listRemoteGitUrl } from "./utils.js";
var Project;
(function (Project) {
    function create(data) {
        return createProject(data);
    }
    Project.create = create;
    function getAll() {
        return getAllProjects();
    }
    Project.getAll = getAll;
    function getById(id) {
        return queryProjectById(id);
    }
    Project.getById = getById;
    function getByName(name) {
        return queryProjectByName(name);
    }
    Project.getByName = getByName;
    function update(data) {
        return updateProject(data);
    }
    Project.update = update;
    function remove(id) {
        return removeProject(id);
    }
    Project.remove = remove;
    function listGitUrl(url) {
        return listRemoteGitUrl(url);
    }
    Project.listGitUrl = listGitUrl;
})(Project || (Project = {}));
export default Project;
