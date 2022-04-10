import { Injectable } from "@nestjs/common";
import CoreModules from "@openci/core";
import { getErrorResponse, getOkResponse } from "../utils.js";

@Injectable()
export class JobService {
  getJobLog(id: number) {
    const res = CoreModules.Job.getJobLog(id);
    if (res) {
      return getOkResponse(res);
    } else {
      return getErrorResponse("Unable to find log file");
    }
  }
}
