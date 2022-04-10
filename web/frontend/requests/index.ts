import axios from "axios";

const Axios = axios.create({
  baseURL: "http://127.0.0.1:12138/api",
});

type Dict = Record<string, any>;

interface ResponseData<T extends Dict = Dict> {
  code: number;
  msg: string;
  data: T;
}

export async function get<T = Dict>(url: string): Promise<ResponseData<T>> {
  const res = await Axios.get<ResponseData<T>>(url);
  return new Promise((resolve, reject) => {
    if (res.data.code) {
      reject(res.data);
    } else {
      resolve(res.data);
    }
  });
}

export async function post<T = Dict>(url: string, data?: any): Promise<ResponseData<T>> {
  const res = await Axios.post<ResponseData<T>>(url, { data });
  return new Promise((resolve, reject) => {
    if (res.data.code) {
      reject(res.data);
    } else {
      resolve(res.data);
    }
  });
}
