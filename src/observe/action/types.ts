/*
 * @Descripttion: 
 * @version: 
 * @Author: ZhengXiaoRui
 * @email: zheng20010712@163.com
 * @Date: 2023-05-14 16:24:13
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-05-14 17:29:36
 */
export interface ActionStoreData {
    type: EVENT_TYPES; // 事件类型
    category: ACTION_TYPES; // 用户行为类型
    status: STATUS_CODE; // 行为状态
    time: number; // 发生时间
    data: any;
}

//后续可能需要调整到types中
export interface InitOptions {
    maxActionStoreNum?: number; //  用户行为存放的最大长度
    beforePushActionStore?(data: ActionStoreData): ActionStoreData; // 添加到行为列表前的 hook
}


/**
 * 事件类型
 */
export enum EVENT_TYPES {
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
 * 用户行为
 */
export enum ACTION_TYPES {
    HTTP = 'Http',
    CLICK = 'Click',
    RESOURCE = 'Resource_Error',
    CODEERROR = 'Code_Error',
    ROUTE = 'Route',
    CUSTOM = 'Custom',
}

export enum STATUS_CODE {
    ERROR = 'error',
    OK = 'ok',
  }
  
  

export type voidFun = (...args: any[]) => void;
