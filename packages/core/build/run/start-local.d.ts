/// <reference types="node" />
import Run from ".";
import stream from "stream";
export default function startLocalProject(path: string, out: stream.Writable, err: stream.Writable, options?: Run.Options): Promise<void>;
