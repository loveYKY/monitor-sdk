/**
 * 事件类型
 */
export enum EVENTTYPES {
  XHR = 'xhr',
  FETCH = 'fetch',
  CLICK = 'click',
  HISTORY = 'history',
  ERROR = 'error',
  HASHCHANGE = 'hashchange',
  UNHANDLEDREJECTION = 'unhandledrejection',
  RESOURCE = 'resource',
  DOM = 'dom',
  VUE = 'vue',
  REACT = 'react',
  CUSTOM = 'custom',
  PERFORMANCE = 'performance',
  RECORDSCREEN = 'recordScreen',
  WHITESCREEN = 'whiteScreen',
}
/**
 * 状态
 */
export enum STATUS_CODE {
  ERROR = 'error',
  OK = 'ok',
}
// 接口超时时长
export const OPTIONS ={
  overTime:10
}