/*
 * @Descripttion: 
 * @version: 
 * @Author: ZhengXiaoRui
 * @email: zheng20010712@163.com
 * @Date: 2023-05-14 19:37:59
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-06-03 16:39:46
 */
import {_global, _support} from "../../utils/global"
import { EVENT_TYPES, ACTION_TYPES, STATUS_CODE } from "../action/types"
import { replaceAop } from "./replace"

export const fetchReaplace = function () {
    const fetchReplaceFn = function(originalFetch: Function) {
        return function (url: string, config: Partial<Request> = {}) {
        //记录开始时间
        const startTime = Date.now()
        // 获取配置的headers
        const headers = new Headers(config.headers || {});
        Object.assign(headers, {
          setRequestHeader: headers.set,
        });
        config = Object.assign({}, config, headers);
        // 调用原始的fetch方法
          return originalFetch.apply(_global, [url,config]).then(() => {
              const curTime = Date.now()
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
          }, () => {
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
        })
        }
      }
    replaceAop(window,'fetch',fetchReplaceFn)
}
