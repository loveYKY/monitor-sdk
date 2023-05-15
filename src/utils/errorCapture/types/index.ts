export interface VueInstance{
  [key:string]:any;
}
export interface ViewModel {
  [key: string]: any;
  $root?: Record<string, unknown>;
  $options?: {
    [key: string]: any;
    name?: string;
    propsData?: IAnyObject;
    _componentTag?: string;
    __file?: string;
    props?: IAnyObject;
  };
  $props?: Record<string, unknown>;
}
export interface IAnyObject {
  [key: string]: any;
}
export interface ErrorTarget {
  target?: {
    localName?: string;
  };
  error?: any;
  message?: string;
}
/**
 * http请求
 */
export interface HttpData {
  type?: string;
  method?: string;
  time: number;
  url: string; // 接口地址
  elapsedTime: number; // 接口时长
  message: string; // 接口信息
  Status?: number; // 接口状态编码
  status?: string; // 接口状态
  requestData?: {
    httpType: string; // 请求类型 xhr fetch
    method: string; // 请求方式
    data: any;
  };
  response?: {
    Status: number; // 接口状态
    data?: any;
  };
}