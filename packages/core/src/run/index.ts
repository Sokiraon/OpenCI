import startLocalProject from "./start-local.js";
import startRemoteProject from "./start-remote.js";
import MessageStream from "./message-stream.js";

namespace Run {
  export type Options = {
    branch?: string;
    input?: string;
    stages?: string[];
  };

  export async function startLocal(
    path: string,
    options?: Options,
    stream?: MessageStream
  ) {
    await startLocalProject(path, options, stream);
  }

  export async function startRemote(
    projectId: number,
    options?: Options,
    stream?: MessageStream
  ) {
    await startRemoteProject(projectId, options, stream);
  }
}

export default Run;
