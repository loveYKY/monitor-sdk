/*
 * @Descripttion: 
 * @version: 
 * @Author: ZhengXiaoRui
 * @email: zheng20010712@163.com
 * @Date: 2023-05-14 17:04:01
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-05-14 19:29:46
 */
import ActionStore from "../observe/action/actionStore"

interface Support {
    actionStore: ActionStore
}

const _support: Support = {
    actionStore: new ActionStore()
}

// 获取全局变量
export function getGlobal(): Window {
    return window as unknown as Window;
  }
const _global = getGlobal();

export {
    _global,
    _support
}