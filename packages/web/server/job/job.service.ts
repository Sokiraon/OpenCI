import Job from "@openci/core/build/job/index.js";
import { Injectable } from "@nestjs/common";
import { getErrorResponse, getOkResponse } from "../utils.js";

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
}
