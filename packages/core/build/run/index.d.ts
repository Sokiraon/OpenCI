import MessageStream from "./message-stream.js";
declare namespace Run {
    type Options = {
        branch?: string;
        input?: string;
        stages?: string[];
    };
    function startLocal(path: string, options?: Options, stream?: MessageStream): Promise<void>;
    function startRemote(projectId: number, options?: Options, stream?: MessageStream): Promise<void>;
}
export default Run;
