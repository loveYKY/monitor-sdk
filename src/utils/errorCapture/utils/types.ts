/**
 * 资源加载目标
 */
export interface ResourceTarget {
  src?: string;
  href?: string;
  localName?: string;
}
/**
 * 资源加载失败
 */
export interface ResouceError {
  time: number;
  message: string; // 加载失败的信息
  name: string; // 脚本类型：js脚本
}
export enum HTTP_CODE {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
}
function isType(type: any) {
  return function (value: any): boolean {
    return Object.prototype.toString.call(value) === `[object ${type}]`;
  };
}
/**
 * 检测变量类型
 * @param type
 */
export const variableTypeDetection = {
  isNumber: isType('Number'),
  isString: isType('String'),
  isBoolean: isType('Boolean'),
  isNull: isType('Null'),
  isUndefined: isType('Undefined'),
  isSymbol: isType('Symbol'),
  isFunction: isType('Function'),
  isObject: isType('Object'),
  isArray: isType('Array'),
  isProcess: isType('process'),
  isWindow: isType('Window'),
};

/**
 * 接口错误状态
 */
export enum SpanStatus {
  Ok = 'ok',
  DeadlineExceeded = 'deadline_exceeded',
  Unauthenticated = 'unauthenticated',
  PermissionDenied = 'permission_denied',
  NotFound = 'not_found',
  ResourceExhausted = 'resource_exhausted',
  InvalidArgument = 'invalid_argument',
  Unimplemented = 'unimplemented',
  Unavailable = 'unavailable',
  InternalError = 'internal_error',
  UnknownError = 'unknown_error',
  Cancelled = 'cancelled',
  AlreadyExists = 'already_exists',
  FailedPrecondition = 'failed_precondition',
  Aborted = 'aborted',
  OutOfRange = 'out_of_range',
  DataLoss = 'data_loss',
}
