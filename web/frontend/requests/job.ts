import { get } from ".";

export const getJobLog = (id: number) => {
  return get<JobLog>(`/job/${id}/log`);
};
