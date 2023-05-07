import observeFirstScreenPaint from "../../utils/firstScreenTime.js";

interface ICacheHitRatio {
  total: number;
  mandatory_caching: number;
  negotiation_cache: number;
  no_cache: number;
  cacheRatio: number;
}

interface IperformenceData {
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
  FirstScreenTime: number;
  CacheHitRatio: ICacheHitRatio;
}

// type Iresource

export class PerformanceMonitor {
  private performance!: Performance;
  private timingInfo!: PerformanceTiming;
  public performanceData!: IperformenceData;

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
      FirstScreenTime: 0,
      CacheHitRatio: {
        total: 0,
        mandatory_caching: 0,
        negotiation_cache: 0,
        no_cache: 0,
        cacheRatio: 0,
      },
    };
    this.performance = window.performance;
    this.timingInfo = window.performance.timing;
  }

  public start() {
    /**
     * 异步检测performance数据是否完备
     */
    this.getFirstScreenTime();
    this.getCacheHitRatio();

    const entry = this.performance.getEntriesByType("navigation")[0];
    if (this.isDataExist(entry)) {
      //启动性能监控
      Promise.all([
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
      ]).then(() => {
        console.log(this.performanceData);
      });
    } else {
      setTimeout(this.start.bind(this), 0);
    }
  }

  private isDataExist(entry: any): boolean {
    return (
      entry && entry.loadEventEnd && entry.responseEnd && entry.domComplete
    );
  }

  // 重定向耗时
  private getRedirectTime() {
    this.performanceData.RedirectTime =
      this.timingInfo.redirectEnd - this.timingInfo.redirectStart;
  }

  // dns查询耗时
  private getDnsTime() {
    this.performanceData.DnsTime =
      this.timingInfo.domainLookupEnd - this.timingInfo.domainLookupStart;
  }

  // tcp连接耗时
  private getTcpTime() {
    this.performanceData.TcpTime =
      this.timingInfo.connectEnd - this.timingInfo.connectStart;
  }

  // 读取页面第一个字节耗时
  private getTimeOfFirstByte() {
    this.performanceData.TimeOfFirstByte =
      this.timingInfo.responseStart - this.timingInfo.navigationStart;
  }

  // request请求耗时
  private getReqTime() {
    this.performanceData.ReqTime =
      this.timingInfo.responseEnd - this.timingInfo.responseStart;
  }

  // 解析纯DOM树耗时, 不包含js css等资源的加载和执行
  private getParsePureDomTime() {
    this.performanceData.ParsePureDomTime =
      this.timingInfo.domInteractive - this.timingInfo.domLoading;
  }

  // 页面资源加载耗时, 包含vue, js css等资源的加载和执行
  private getDomContentLoadTime() {
    this.performanceData.DomContentLoadTime =
      this.timingInfo.domComplete - this.timingInfo.domInteractive;
  }

  // 页面load总耗时
  private getLoadTime() {
    this.performanceData.LoadTime =
      this.timingInfo.loadEventStart - this.timingInfo.navigationStart;
  }

  //FP time，白屏时间
  private async getFpTime() {
    const entryHandler: PerformanceObserverCallback = (list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === "first-paint") {
          this.performanceData.FP_Time = entry.startTime;
          observer.disconnect();
        }
      }
    };
    const observer = new PerformanceObserver(entryHandler);
    observer.observe({ type: "paint", buffered: true });
  }

  // 首次内容绘制时间 FCP
  private async getFcpTime() {
    const entryHandler: PerformanceObserverCallback = (list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === "first-contentful-paint") {
          this.performanceData.FCP_Time = entry.startTime;
          observer.disconnect();
        }
      }
    };
    const observer = new PerformanceObserver(entryHandler);
    observer.observe({ type: "paint", buffered: true });
  }

  // 最大内容绘制时间 LCP
  private async getLcpTime() {
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
    observer.observe({ type: "largest-contentful-paint", buffered: true });
  }

  // 首屏时间 FirstScreenTime
  private getFirstScreenTime() {
    observeFirstScreenPaint((time: number) => {
      this.performanceData.FirstScreenTime = time;
    });
  }

  //计算资源的缓存命中率
  private getCacheHitRatio() {
    let resources = this.performance.getEntries();
    let total = resources.length;
    let mandatory_caching = 0;
    let negotiation_cache = 0;
    let no_cache = 0;

    for (let resource of resources as PerformanceResourceTiming[]) {
      //强制缓存
      if (resource.transferSize === 0) {
        mandatory_caching++;
      }
      //协商缓存
      else if (resource.encodedBodySize === 0) {
        negotiation_cache++;
      } else {
        no_cache++;
      }
    }

    this.performanceData.CacheHitRatio = {
      total,
      mandatory_caching,
      negotiation_cache,
      no_cache,
      cacheRatio: 1 - no_cache / total,
    };
  }
}
