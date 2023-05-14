/*
 * @Descripttion: 
 * @version: 
 * @Author: ZhengXiaoRui
 * @email: zheng20010712@163.com
 * @Date: 2023-05-14 16:24:13
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-05-14 17:47:51
 */
import { getTimestamp, validateOption } from "../../utils/action";
import _support from "../../utils/global";
import { ActionStoreData, ACTION_TYPES, EVENT_TYPES, InitOptions } from "./types";

/*
 * @Descripttion: 
 * @version: 
 * @Author: ZhengXiaoRui
 * @email: zheng20010712@163.com
 * @Date: 2023-05-06 13:46:27
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-05-14 16:25:33
 */
class ActionStore {
    //用户行为存放的最大长度
    //即我们在监控系统中可查看用户行为的历史行为数量
    _maxActionStoreNum: number = 30;
    //用户行为之前执行函数
    _beforePushActionStore: unknown = null
    //存放用户行为
    _store: ActionStoreData[] = []

    get store() {
        return this._store
    }

    shift() {
        return this._store.shift() !== undefined
    }
    clear() {
        this._store = []
    }

  push(data: ActionStoreData) {
      console.log(this._store)
        if (typeof this._beforePushActionStore === 'function') {
            //如果用户有自定义的hook
            const result = this._beforePushActionStore(data) as ActionStoreData //需要强制转换类型
            if (result) this.immediatePush(result)
            return
        }
        this.immediatePush(data)
    }

    immediatePush(data: ActionStoreData) {
        data.time = data.time || getTimestamp()
        if (this._store.length >= this._maxActionStoreNum) {
            this.shift()
        }
        this._store.push(data)
        this._store.sort((a,b) => a.time-b.time)
    }

    getCategory(type: EVENT_TYPES): ACTION_TYPES{
        switch (type) {
        // 接口请求
      case EVENT_TYPES.XHR:
        case EVENT_TYPES.FETCH:
          return ACTION_TYPES.HTTP;
  
        // 用户点击
        case EVENT_TYPES.CLICK:
          return ACTION_TYPES.CLICK;
  
        // 路由变化
        case EVENT_TYPES.HISTORY:
        case EVENT_TYPES.HASHCHANGE:
          return ACTION_TYPES.ROUTE;
  
        // 加载资源
        case EVENT_TYPES.RESOURCE:
          return ACTION_TYPES.RESOURCE;
  
        // Js代码报错
        case EVENT_TYPES.UNHANDLEDREJECTION:
        case EVENT_TYPES.ERROR:
          return ACTION_TYPES.CODEERROR;
  
        // 用户自定义
        default:
          return ACTION_TYPES.CUSTOM;
      }
    }
    bindOptions(options: InitOptions) {
        const { maxActionStoreNum, beforePushActionStore } = options
        validateOption(maxActionStoreNum, 'maxActionStoreNum', 'number') &&
        (this._maxActionStoreNum = maxActionStoreNum || 20);
      validateOption(beforePushActionStore, 'beforePushActionStore', 'function') &&
        (this._beforePushActionStore = beforePushActionStore);
    }
}
export default ActionStore