/// <reference types="node" />
import stream from "stream";
declare class Reporter {
    #private;
    init(filePath: string, out: stream.Writable, err?: stream.Writable): void;
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
