import { getTimestamp,interceptStr } from "./util";
import { ResourceTarget,ResouceError,HTTP_CODE,SpanStatus } from "./types";
import { HttpData } from "../types";
import { STATUS_CODE,OPTIONS } from "../constants";
export function resourceTransform(target: ResourceTarget): ResouceError {
  return {
    time: getTimestamp(),
    message:
      (interceptStr(target.src as string, 120) || interceptStr(target.href as string, 120)) +
      '; 资源加载失败',
    name: target.localName as string,
  };
}

// 处理接口的状态
export function httpTransform(data: HttpData): HttpData {
  let message: any = '';
  const { elapsedTime, time, method = '', type, Status = 200, response, requestData } = data;
  let status: STATUS_CODE;
  if (Status === 0) {
    status = STATUS_CODE.ERROR;
    message =
      elapsedTime <= OPTIONS.overTime * 1000
        ? `请求失败，Status值为:${Status}`
        : '请求失败，接口超时';
  } else if ((Status as number) < HTTP_CODE.BAD_REQUEST) {
    status = STATUS_CODE.OK;
    
  } else {
    status = STATUS_CODE.ERROR;
    message = `请求失败，Status值为:${Status}，${fromHttpStatus(Status as number)}`;
  }
  message = `${data.url}; ${message}`;
  return {
    url: data.url,
    time,
    status,
    elapsedTime,
    message,
    requestData: {
      httpType: type as string,
      method,
      data: requestData || '',
    },
    response: {
      Status,
      data: status == STATUS_CODE.ERROR ? response : null,
    },
  };
}
export function fromHttpStatus(httpStatus: any) {
  if (httpStatus < 400) {
    return SpanStatus.Ok;
  }
  if (httpStatus >= 400 && httpStatus < 500) {
    switch (httpStatus) {
      case 401:
        return SpanStatus.Unauthenticated;
      case 403:
        return SpanStatus.PermissionDenied;
      case 404:
        return SpanStatus.NotFound;
      case 409:
        return SpanStatus.AlreadyExists;
      case 413:
        return SpanStatus.FailedPrecondition;
      case 429:
        return SpanStatus.ResourceExhausted;
      default:
        return SpanStatus.InvalidArgument;
    }
  }
  if (httpStatus >= 500 && httpStatus < 600) {
    switch (httpStatus) {
      case 501:
        return SpanStatus.Unimplemented;
      case 503:
        return SpanStatus.Unavailable;
      case 504:
        return SpanStatus.DeadlineExceeded;
      default:
        return SpanStatus.InternalError;
    }
  }
  return SpanStatus.UnknownError;
}