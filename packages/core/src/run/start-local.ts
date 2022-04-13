import Run from ".";
import stream from "stream";
import reporter from "./reporter";
import { join } from "path";
import { getDateStr } from "../helpers";
import { prepareWorkspace } from "./initialization";

export default async function startLocalProject(
  path: string,
  out: stream.Writable,
  err: stream.Writable,
  options?: Run.Options
) {
  reporter.init(join(path, "CILogs", `job_log-${getDateStr()}.log`), out, err);
  await prepareWorkspace(options?.branch);
}
