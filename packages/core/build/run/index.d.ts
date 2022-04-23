/// <reference types="node" />
import stream from "stream";
declare namespace Run {
    type Options = {
        branch?: string;
        input?: string;
        stages?: string[];
    };
    function startLocal(path: string, out: stream.Writable, err?: stream.Writable, options?: Options): Promise<void>;
    function startRemote(projectId: number, out: stream.Writable, err?: stream.Writable, options?: Options): Promise<void>;
}
export default Run;
