type Dict = Record<string, any>;

interface ResponseData<T extends Dict = Dict> {
  code: number;
  msg: string;
  data: T;
}

type ErrorResponseData = ResponseData<Record<string, never>>;
