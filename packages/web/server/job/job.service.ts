import { Job, Run } from "@openci/core";
import { Injectable } from "@nestjs/common";
import { defaultOkResponse, getErrorResponse, getOkResponse } from "../utils.js";

@Injectable()
export class JobService {
  getJobLog(id: number) {
    const res = Job.getJobLog(id);
    if (res) {
      return getOkResponse(res);
    } else {
      return getErrorResponse("Unable to find log file");
    }
  }

  startJob(projectId: number, options?: Run.Options) {
    Run.startRemote(projectId, options);
    return defaultOkResponse;
  }
}
