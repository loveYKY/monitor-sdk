/*
 * @Descripttion: 
 * @version: 
 * @Author: ZhengXiaoRui
 * @email: zheng20010712@163.com
 * @Date: 2023-05-14 17:04:01
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-05-14 17:24:16
 */
import ActionStore from "../observe/action/actionStore"

interface Support {
    actionStore: ActionStore
}

const _support: Support = {
    actionStore: new ActionStore()
}


export default _support