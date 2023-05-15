/*
 * @Descripttion: 
 * @version: 
 * @Author: ZhengXiaoRui
 * @email: zheng20010712@163.com
 * @Date: 2023-05-14 16:24:51
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-05-14 16:25:00
 */
/**
 * 此文件为用户行为监控需要的工具函数
 */



export function getLocationHref(): string {
    if (typeof document === 'undefined' || document.location == null) return '';
    return document.location.href;
}
  
/**
 * 此文件为共同需要使用的工具函数
 */



export function getTimestamp(): number {
    return Date.now()
}

export function typeofAny(target: any): string {
    return Object.prototype.toString.call(target).slice(8, -1).toLowerCase();
  }

export function validateOption(target: any, targetName: string, expectType: string) {
  if (!target) return false;
  if (typeofAny(target) === expectType) return true;
  console.error(`${targetName}期望传入${expectType}类型，目前是${typeofAny(target)}类型`);
}