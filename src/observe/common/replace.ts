export function replaceAop(source: any, name: string, fn: Function) {
    if (source === undefined) return;
    if (name in source) {
      var original = source[name];
      var wrapped = fn(original);
      if (typeof wrapped === "function") {
        source[name] = wrapped;
      }
    }
  }
  