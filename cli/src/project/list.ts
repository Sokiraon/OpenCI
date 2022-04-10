import CoreModules from "@openci/core";
import Printer from "../printer.js";

interface ListOptions {
  verbose?: boolean;
}

export default function list(options: ListOptions) {
  const projects = CoreModules.Project.getAll();
  if (projects.length === 0) {
    Printer.warn("No configured project found");
  } else {
    if (options.verbose) {
      projects.forEach(project => {
        console.log(`${project.name}\t${project.src}`);
      });
    } else {
      projects.forEach(project => {
        console.log(project.name);
      });
    }
  }
}