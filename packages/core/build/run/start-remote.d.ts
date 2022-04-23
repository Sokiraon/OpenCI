/// <reference types="node" />
import stream from "stream";
import Run from ".";
export default function startRemoteProject(projectId: number, out: stream.Writable, err: stream.Writable, options?: Run.Options): Promise<void>;
