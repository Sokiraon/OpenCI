import startLocalProject from "./start-local.js";
import stream from "stream";
import startRemoteProject from "./start-remote.js";

namespace Run {
  export type Options = {
    branch?: string;
    input?: string;
    stages?: string[];
  };

  export async function startLocal(
    path: string,
    out: stream.Writable,
    err: stream.Writable = out,
    options?: Options
  ) {
    await startLocalProject(path, out, err, options);
  }

  export async function startRemote(
    projectId: number,
    out: stream.Writable,
    err: stream.Writable = out,
    options?: Options
  ) {
    await startRemoteProject(projectId, out, err, options);
  }
}

export default Run;
