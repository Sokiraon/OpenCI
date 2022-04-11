export function getOkResponse<Type extends Record<string, any>>(
  data: Type
): ResponseData<Type> {
  return {
    code: 0,
    msg: "",
    data,
  };
}

export function getErrorResponse(msg: string): ErrorResponseData {
  return {
    code: -1,
    msg,
    data: {},
  };
}

export const defaultErrorResponse: ErrorResponseData = {
  code: -1,
  msg: "internal server error",
  data: {},
};
