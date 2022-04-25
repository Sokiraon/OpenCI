import { Job, Run } from "@openci/core";
import { Injectable, Scope } from "@nestjs/common";
import { defaultOkResponse, getErrorResponse, getOkResponse } from "../utils.js";

@Injectable({ scope: Scope.REQUEST })
export class JobService {
  getJobDetail(id: number) {
    const res = Job.getJobDetail(id);
    if (res) {
      return getOkResponse(res);
    } else {
      return getErrorResponse("Unable to get job detail");
    }
  }

  startJob(projectId: number, options?: Run.Options) {
    Run.startRemote(projectId, options);
    return defaultOkResponse;
  }
}
