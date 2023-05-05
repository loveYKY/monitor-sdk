//performance 性能监控
import { performanceObj } from "./types";

export class PerformanceMonitor {
  private performance!: Performance;
  private timingInfo!: PerformanceTiming;
  public performanceData: any;

  constructor() {
    if (!window.performance || !window.performance.timing) {
      console.warn("Your browser does not suppport performance api.");
      return;
    }

    this.performance = window.performance;
    this.timingInfo = window.performance.timing;
  }

  public start() {
    /**
     * 异步检测performance数据是否完备
     */
    const entry = this.performance.getEntriesByType("navigation")[0];
    if (this.isDataExist(entry)) {
      //...
      Promise.all([
        this.getRedirectTime(),
        this.getDnsTime(),
        this.getDomContentLoadTime(),
        this.getFpTime(),
        this.getLoadTime(),
        this.getParsePureDomTime(),
        this.getReqTime(),
        this.getTcpTime(),
        this.getTimeOfFirstByte(),
        this.getFpTime(),
        this.getFcpTime(),
        this.getLcpTime(),
      ]).then((res) => {
        this.performanceData = res;
      });
    } else setTimeout(this.start.bind(this), 0);
  }

  private isDataExist(entry: any): boolean {
    return (
      entry && entry.loadEventEnd && entry.responseEnd && entry.domComplete
    );
  }

  // 重定向耗时
  public getRedirectTime(): performanceObj {
    return {
      name: "RedirectTime",
      startTime: this.timingInfo.redirectStart,
      duration: this.timingInfo.redirectEnd - this.timingInfo.redirectStart,
    };
  }

  // dns查询耗时
  public getDnsTime(): performanceObj {
    return {
      name: "DnsSearchTime",
      startTime: this.timingInfo.domainLookupStart,
      duration:
        this.timingInfo.domainLookupEnd - this.timingInfo.domainLookupStart,
    };
  }

  // tcp连接耗时
  public getTcpTime(): performanceObj {
    return {
      name: "TcpConnectTime",
      startTime: this.timingInfo.connectStart,
      duration: this.timingInfo.connectEnd - this.timingInfo.connectStart,
    };
  }

  // 读取页面第一个字节耗时
  public getTimeOfFirstByte(): performanceObj {
    return {
      name: "TimeOfFirstByte",
      startTime: this.timingInfo.navigationStart,
      duration: this.timingInfo.responseStart - this.timingInfo.navigationStart,
    };
  }

  // request请求耗时
  public getReqTime(): performanceObj {
    return {
      name: "requestTime",
      startTime: this.timingInfo.responseStart,
      duration: this.timingInfo.responseEnd - this.timingInfo.responseStart,
    };
  }

  // 解析纯DOM树耗时, 不包含js css等资源的加载和执行
  public getParsePureDomTime(): performanceObj {
    return {
      name: "ParsePureDomTime",
      startTime: this.timingInfo.domLoading,
      duration: this.timingInfo.domInteractive - this.timingInfo.domLoading,
    };
  }

  // 页面资源加载耗时, 包含vue, js css等资源的加载和执行
  public getDomContentLoadTime(): performanceObj {
    return {
      name: "DomContentLoadTime",
      startTime: this.timingInfo.domInteractive,
      duration: this.timingInfo.domComplete - this.timingInfo.domInteractive,
    };
  }

  // 页面load总耗时
  public getLoadTime(): performanceObj {
    return {
      name: "LoadTime",
      startTime: this.timingInfo.navigationStart,
      duration:
        this.timingInfo.loadEventStart - this.timingInfo.navigationStart,
    };
  }

  //FP time，首屏/白屏时间
  public async getFpTime(): Promise<performanceObj> {
    return new Promise((resolve, reject) => {
      let target: performanceObj | null = null;

      const entryHandler: PerformanceObserverCallback = (list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === "first-paint") {
            target = {
              name: entry.name,
              entryType: entry.entryType,
              startTime: entry.startTime,
              duration: entry.duration,
            };
            resolve(target);
            observer.disconnect();
          }
        }
      };
      const observer = new PerformanceObserver(entryHandler);
      // buffered 属性表示是否观察缓存数据，也就是说观察代码添加时机比事情触发时机晚也没关系。
      observer.observe({ type: "paint", buffered: true });
    });
  }

  // 首次内容绘制时间 FCP
  public async getFcpTime(): Promise<performanceObj> {
    return new Promise((resolve, reject) => {
      let target: performanceObj | null = null;

      const entryHandler: PerformanceObserverCallback = (list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === "first-contentful-paint") {
            target = {
              name: entry.name,
              entryType: entry.entryType,
              startTime: entry.startTime,
              duration: entry.duration,
            };
            resolve(target);
            observer.disconnect();
          }
        }
      };
      const observer = new PerformanceObserver(entryHandler);
      // buffered 属性表示是否观察缓存数据，也就是说观察代码添加时机比事情触发时机晚也没关系。
      observer.observe({ type: "paint", buffered: true });
    });
  }

  // 最大内容绘制时间 LCP
  public async getLcpTime(): Promise<performanceObj> {
    return new Promise((resolve, reject) => {
      let target: performanceObj | null = null;
      let LCP: any = null;
      const entryHandler: PerformanceObserverCallback = (list) => {
        if (observer) {
          observer.disconnect();
        }
        for (const entry of list.getEntries()) {
          // 最大内容绘制时间
          LCP = entry;
        }
        target = {
          name: LCP.name,
          entryType: LCP.entryType,
          startTime: LCP.startTime,
          duration: LCP.duration,
        };
        resolve(target);
      };
      const observer = new PerformanceObserver(entryHandler);
      // buffered 属性表示是否观察缓存数据，也就是说观察代码添加时机比事情触发时机晚也没关系。
      observer.observe({ type: "largest-contentful-paint", buffered: true });
    });
  }
}
