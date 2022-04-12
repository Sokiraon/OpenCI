import Project from "@openci/core/build/project";
import Printer from "../printer.js";
export default function list(options) {
    const projects = Project.getAll();
    if (projects.length === 0) {
        Printer.warn("No configured project found");
    }
    else {
        if (options.verbose) {
            projects.forEach(project => {
                console.log(`${project.name}\t${project.src}`);
            });
        }
        else {
            projects.forEach(project => {
                console.log(project.name);
            });
        }
    }
}
