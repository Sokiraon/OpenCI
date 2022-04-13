import startLocalProject from "./start-local.js";
import stream from "stream";

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

  export function startProject(options?: Options) {}
}

export default Run;
