/*
 * @Descripttion: 
 * @version: 
 * @Author: ZhengXiaoRui
 * @email: zheng20010712@163.com
 * @Date: 2023-05-14 17:37:05
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-06-03 16:40:22
 */
import { fetchReaplace } from "../common/fetch";
import { xhrReplace } from "../common/xhr";
import { domReplace } from "./click";
import { historyReplace } from "./router";

export default class ActionMonitor {
    start() {
        this.init()
    }
    init() {
        historyReplace()
        domReplace()
        xhrReplace()
        fetchReaplace()
    }
}

