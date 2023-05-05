//performance 性能监控
import { performanceObj } from "./types";

interface IperformenceDaya {
  RedirectTime: number;
  DnsTime: number;
  DomContentLoadTime: number;
  LoadTime: number;
  ParsePureDomTime: number;
  ReqTime: number;
  TcpTime: number;
  TimeOfFirstByte: number;
  FP_Time: number;
  FCP_Time: number;
  LCP_Time: number;
}

export class PerformanceMonitor {
  private performance!: Performance;
  private timingInfo!: PerformanceTiming;
  public performanceData!: IperformenceDaya;

  constructor() {
    if (!window.performance || !window.performance.timing) {
      console.warn("Your browser does not suppport performance api.");
      return;
    }

    this.performanceData = {
      RedirectTime: 0,
      DnsTime: 0,
      DomContentLoadTime: 0,
      LoadTime: 0,
      ParsePureDomTime: 0,
      ReqTime: 0,
      TcpTime: 0,
      TimeOfFirstByte: 0,
      FP_Time: 0,
      FCP_Time: 0,
      LCP_Time: 0,
    };
    this.performance = window.performance;
    this.timingInfo = window.performance.timing;
  }

  public async start() {
    /**
     * 异步检测performance数据是否完备
     */
    const entry = this.performance.getEntriesByType("navigation")[0];
    if (this.isDataExist(entry)) {
      //...
      await Promise.all([
        this.getRedirectTime(),
        this.getDnsTime(),
        this.getDomContentLoadTime(),
        this.getLoadTime(),
        this.getParsePureDomTime(),
        this.getReqTime(),
        this.getTcpTime(),
        this.getTimeOfFirstByte(),
        this.getFpTime(),
        this.getFcpTime(),
        this.getLcpTime(),
      ]);
      console.log(this.performanceData)
    } else setTimeout(this.start.bind(this), 0);
  }

  private isDataExist(entry: any): boolean {
    return (
      entry && entry.loadEventEnd && entry.responseEnd && entry.domComplete
    );
  }

  // 重定向耗时
  public getRedirectTime() {
    this.performanceData.RedirectTime =
      this.timingInfo.redirectEnd - this.timingInfo.redirectStart;
  }

  // dns查询耗时
  public getDnsTime() {
    this.performanceData.DnsTime =
      this.timingInfo.domainLookupEnd - this.timingInfo.domainLookupStart;
  }

  // tcp连接耗时
  public getTcpTime() {
    this.performanceData.TcpTime =
      this.timingInfo.connectEnd - this.timingInfo.connectStart;
  }

  // 读取页面第一个字节耗时
  public getTimeOfFirstByte() {
    this.performanceData.TimeOfFirstByte =
      this.timingInfo.responseStart - this.timingInfo.navigationStart;
  }

  // request请求耗时
  public getReqTime() {
    this.performanceData.ReqTime =
      this.timingInfo.responseEnd - this.timingInfo.responseStart;
  }

  // 解析纯DOM树耗时, 不包含js css等资源的加载和执行
  public getParsePureDomTime() {
    this.performanceData.ParsePureDomTime =
      this.timingInfo.domInteractive - this.timingInfo.domLoading;
  }

  // 页面资源加载耗时, 包含vue, js css等资源的加载和执行
  public getDomContentLoadTime() {
    this.performanceData.DomContentLoadTime =
      this.timingInfo.domComplete - this.timingInfo.domInteractive;
  }

  // 页面load总耗时
  public getLoadTime() {
    this.performanceData.LoadTime =
      this.timingInfo.loadEventStart - this.timingInfo.navigationStart;
  }

  //FP time，首屏/白屏时间
  public async getFpTime() {
    const entryHandler: PerformanceObserverCallback = (list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === "first-paint") {
          this.performanceData.FP_Time = entry.startTime;
          observer.disconnect();
        }
      }
    };
    const observer = new PerformanceObserver(entryHandler);
    // buffered 属性表示是否观察缓存数据，也就是说观察代码添加时机比事情触发时机晚也没关系。
    observer.observe({ type: "paint", buffered: true });
  }

  // 首次内容绘制时间 FCP
  public async getFcpTime() {
    const entryHandler: PerformanceObserverCallback = (list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === "first-contentful-paint") {
          this.performanceData.FCP_Time = entry.startTime;
          observer.disconnect();
        }
      }
    };
    const observer = new PerformanceObserver(entryHandler);
    // buffered 属性表示是否观察缓存数据，也就是说观察代码添加时机比事情触发时机晚也没关系。
    observer.observe({ type: "paint", buffered: true });
  }

  // 最大内容绘制时间 LCP
  public async getLcpTime() {
    const entryHandler: PerformanceObserverCallback = (list) => {
      if (observer) {
        observer.disconnect();
      }
      for (const entry of list.getEntries()) {
        // 最大内容绘制时间
        this.performanceData.LCP_Time = entry.startTime;
      }
    };
    const observer = new PerformanceObserver(entryHandler);
    // buffered 属性表示是否观察缓存数据，也就是说观察代码添加时机比事情触发时机晚也没关系。
    observer.observe({ type: "largest-contentful-paint", buffered: true });
  }
}
