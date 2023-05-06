// firstScreenPaint为首屏加载时间的变量
let firstScreenPaint = 0;
// 页面是否渲染完成
let isOnLoaded = false;
let timer: any;
let observer: any;

// 定时器循环监听dom的变化，当document.readyState === 'complete'时，停止监听
function checkDOMChange(callback: any) {
  cancelAnimationFrame(timer);
  timer = requestAnimationFrame(() => {
    if (document.readyState === "complete") {
      isOnLoaded = true;
    }
    if (isOnLoaded) {
      // 取消监听
      observer && observer.disconnect();

      // document.readyState === 'complete'时，计算首屏渲染时间
      firstScreenPaint = getRenderTime();
      entries = [];

      // 执行用户传入的callback函数
      callback && callback(firstScreenPaint);
    } else {
      checkDOMChange(callback);
    }
  });
}
function getRenderTime() {
  let startTime = 0;
  entries.forEach((entry) => {
    if (entry.startTime > startTime) {
      startTime = entry.startTime;
    }
  });
  // performance.timing.navigationStart 页面的起始时间
  return startTime - performance.timing.navigationStart;
}

const viewportWidth = window.innerWidth;
const viewportHeight = window.innerHeight;
// dom 对象是否在屏幕内
function isInScreen(dom: any) {
  const rectInfo = dom.getBoundingClientRect();
  if (rectInfo.left < viewportWidth && rectInfo.top < viewportHeight) {
    return true;
  }
  return false;
}

let entries: any[] = [];

interface entryType {
  children: any[];
  startTime: number;
}

// 外部通过callback 拿到首屏加载时间
export default function observeFirstScreenPaint(callback: any) {
  const ignoreDOMList = ["STYLE", "SCRIPT", "LINK"];
  observer = new window.MutationObserver((mutationList) => {
    checkDOMChange(callback);
    const entry: entryType = { children: [], startTime: 0 };
    for (const mutation of mutationList) {
      if (mutation.addedNodes.length && isInScreen(mutation.target)) {
        for (const node of mutation.addedNodes) {
          // 忽略掉以上标签的变化
          if (
            node.nodeType === 1 &&
            !ignoreDOMList.includes(node.nodeName) &&
            isInScreen(node)
          ) {
            entry.children.push(node);
          }
        }
      }
    }

    if (entry.children.length) {
      entries.push(entry);
      entry.startTime = new Date().getTime();
    }
  });
  observer.observe(document, {
    childList: true, // 监听添加或删除子节点
    subtree: true, // 监听整个子树
    characterData: true, // 监听元素的文本是否变化
    attributes: true, // 监听元素的属性是否变化
  });
}
