import { record, pack } from "rrweb";
import { recordOptions } from "rrweb/typings/types";

export class PageRecord {
  events: any[]; // events存储录屏信息
  hasRecord: boolean;
  url: string;

  constructor(url: string) {
    this.events = [];
    this.url = url;
    this.hasRecord = false;
  }

  public beginRecord() {
    //开启录屏
    this.hasRecord = true;
    // record 用于记录 `DOM` 中的所有变更
    let that = this;
    record({
      emit(event, isCheckout) {
        // isCheckout 是一个标识，告诉你重新制作了快照
        if (isCheckout) {
          that.events.push([]);
        }
        that.events.push(event);
      },
      packFn: pack,
      recordCanvas: true, // 记录 canvas 内容
      checkoutEveryNms: 10 * 1000, // 每10s重新制作快照
      checkoutEveryNth: 200, // 每 200 个 event 重新制作快照
    });
  }

  public transportData() {
    //数据上报
  }
}
