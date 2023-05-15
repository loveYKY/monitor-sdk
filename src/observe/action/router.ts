/*
 * @Descripttion: 
 * @version: 
 * @Author: ZhengXiaoRui
 * @email: zheng20010712@163.com
 * @Date: 2023-05-14 16:30:59
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-05-14 19:14:29
 */
/*
 * @Descripttion: 
 * @version: 
 * @Author: ZhengXiaoRui
 * @email: zheng20010712@163.com
 * @Date: 2023-05-14 16:30:59
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-05-14 17:51:47
 */
/*
 * @Descripttion: 
 * @version: 
 * @Author: ZhengXiaoRui
 * @email: zheng20010712@163.com
 * @Date: 2023-05-14 16:30:59
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-05-14 16:57:35
 */

import {_global, _support} from "../../utils/global"
import { replaceAop } from "../common/replace"
import { ACTION_TYPES, EVENT_TYPES, STATUS_CODE } from "./types"

// lastHref 前一个页面的路由
let lastHref: string = document.location.href
export function historyReplace() {
    function historyReplaceFn(originHistoryFn: Function) {
        return function (...args:  any[]) {
            const url: string | undefined = args.length > 2 ? args[2] : undefined
            if (url) {
                const from: string = lastHref
                const to = String(url)
                lastHref = to
                _support.actionStore.push({
                    type: EVENT_TYPES.HISTORY,
                    category: ACTION_TYPES.ROUTE,
                    data: {
                        from: from,
                        to: to,
                        url: url
                    },
                    time: Date.now(),
                    status: STATUS_CODE.OK
                })
            }
            return originHistoryFn.apply(_global,args)
        }
    }
      // 重写pushState事件
  replaceAop(window.history, "pushState", historyReplaceFn);
  // 重写replaceState事件
  replaceAop(window.history, "replaceState", historyReplaceFn);
}

