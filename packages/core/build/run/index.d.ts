import MessageStream from "./utils/message-stream.js";
declare namespace Run {
    type Options = {
        branch?: string;
        input?: string;
        stages?: string[];
    };
    function startLocal(path: string, options: Options, messageStream: MessageStream.Duplex): Promise<void>;
    function startRemote(projectId: number, options: Options, messageStream: MessageStream.Duplex): Promise<void>;
}
export default Run;
