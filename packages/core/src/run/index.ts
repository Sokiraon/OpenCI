import startLocalProject from "./start-local.js";
import startRemoteProject from "./start-remote.js";
import MessageStream from "./utils/message-stream.js";

namespace Run {
  export type Options = {
    branch?: string;
    input?: string;
    stages?: string[];
  };

  export async function startLocal(
    path: string,
    options: Options,
    messageStream: MessageStream.Duplex,
  ) {
    await startLocalProject(path, options, messageStream);
  }

  export async function startRemote(
    projectId: number,
    options: Options,
    messageStream: MessageStream.Duplex,
  ) {
    await startRemoteProject(projectId, options, messageStream);
  }
}

export default Run;
