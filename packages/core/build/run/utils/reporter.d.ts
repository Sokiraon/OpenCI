import Project from "../../project/index.js";
import Job from "../../job/index.js";
import MessageStream from "./message-stream.js";
declare class Reporter {
    #private;
    init(pathSpecifier: string | Project.Record, messageStream?: MessageStream.Duplex): void;
    updateJobStatus(newStatus: Job.Status): void;
    success(message: string): void;
    info(message: string): void;
    warn(message: string): void;
    error(message: string): void;
    sysCommand(message: string): void;
    userCommand(message: string): void;
    common(message: string): void;
}
declare const reporter: Reporter;
export default reporter;
