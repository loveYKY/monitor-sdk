/*
 * @Descripttion: 
 * @version: 
 * @Author: ZhengXiaoRui
 * @email: zheng20010712@163.com
 * @Date: 2023-05-14 19:13:09
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-06-03 16:37:16
 */
// const originalOpen = XMLHttpRequest.prototype.open

import { getTimestamp } from "../../utils/action";
import { _global, _support } from "../../utils/global";
import { ACTION_TYPES, EVENT_TYPES, STATUS_CODE, voidFun } from "../action/types";
import { replaceAop } from "./replace";

export function xhrReplace(): void{
    if (!('XMLHttpRequest' in _global)) {
        return
    }
    const originalXhrProto = XMLHttpRequest.prototype
    const xhrOpenReplace = function (originalOpen: voidFun) {
        return function (this: any, ...args: any[]): void {
            console.log('xhrOpenReplace')
            //后续可能补逻辑
            this.xhrData = {
                startTime: getTimestamp(),
              };
            originalOpen.apply(this, args);
        }
    }
    const xhrSendReplace = function (originalSend: voidFun) {
        return function (this: any, ...args: any[]): void {
            console.log('xhrSendReplace')
            //后续可能补逻辑
            originalSend.apply(this, args);
        }
    }
    const xhrOnloadReplace = function (originalOnload: voidFun) {
        return function (this: any, ...args: any[]): void {
            //TODO: 考虑到其他状态码,可能改正则
            console.log('xhrOnloadReplace')
            const curTime = Date.now()
            const {startTime} = this.xhrData
            if (this.readyState === 4 && this.status === 200) {
                _support.actionStore.push({
                    type: EVENT_TYPES.FETCH, // 事件类型
                    category: ACTION_TYPES.HTTP, // 用户行为类型
                    status: STATUS_CODE.OK, // 行为状态
                    time: curTime, // 发生时间
                      data: {
                          startTime: startTime,
                          endTime: curTime
                    }
                })
            } else {
                const curTime = Date.now()
                _support.actionStore.push({
                    type: EVENT_TYPES.FETCH, // 事件类型
                    category: ACTION_TYPES.HTTP, // 用户行为类型
                    status: STATUS_CODE.ERROR,// 行为状态
                    time: curTime, // 发生时间
                    data: {
                        startTime: startTime,
                        endTime: curTime
                    }
            })
            }
            originalOnload.apply(this, args)
        }
    }
    replaceAop(originalXhrProto,'open',xhrOpenReplace)
    replaceAop(originalXhrProto, 'send', xhrSendReplace)
    replaceAop(originalXhrProto,'onload',xhrOnloadReplace)
}