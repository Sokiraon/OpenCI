var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import chalk from "chalk";
import { Project } from "@openci/core";
import { promptConfirm } from "../helpers.js";
import Printer from "../printer.js";
export default function remove(projectNames, options) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const projectName of projectNames) {
            const coloredName = chalk.blue(projectName);
            const record = Project.getByName(projectName);
            if (record === undefined) {
                Printer.error(`Unable to find project [${coloredName}]\n`);
            }
            else {
                if (!options.force) {
                    Printer.info("Project To Be Removed:");
                    console.log("------------------------");
                    console.log(`Name: ${chalk.blue(record.name)}`);
                    console.log(`Description: ${chalk.blue(record.description)}`);
                    console.log(`Repo Src: ${chalk.blue(record.src)}`);
                    console.log(`Default Branch: ${chalk.blue(record.defaultBranch)}`);
                    console.log("------------------------");
                    if ((yield promptConfirm("Are you sure to remove it?")) === false) {
                        Printer.info("Operation cancelled, heading to next...\n");
                        continue;
                    }
                }
                Project.remove(record.id);
                Printer.success(`Successfully removed project [${projectName}]\n`);
            }
        }
        Printer.success("Finished all the operations!");
    });
}
