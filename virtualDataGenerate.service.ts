/**
 * Author: Hengzhao Hong
 */

import { Injectable } from '@angular/core';

interface IOption {
  [key: string]: any;
}

interface IMockTotalResult {
  [key: string]: any;
}

@Injectable()
export class VirtualDataGenerateService {
  data: IMockTotalResult = {};

  /** 判断一个变量是否为数组
   *
   * @param obj: any, 希望判断的变量
   */
  static isArray(obj: any): Boolean {
    return Object.prototype.toString.call(obj) === '[object Array]';
  }

  constructor() {}

  /** 传入配置对象，生成模拟数据
   *
   * @param OPTION_OBJ:{[key: string]: Array<string | Array<any> | number>; } ，键名 key 是组件内储存相应数据的变量名，
   * 键值是一个数组，数组的元素可以是 string 或 Array<any>，最后一个元素可以是 number 类型。
   * * 若元素是 string ，那么它是字段名，将直接模拟出 string 类型的字段值。
   * * 若数组的最后一个元素是数字，那么该数字表示生成的模拟数据条数。
   * * * 特别地，若上述数字是 1，那么将生成单个模拟对象，而不是对象数组。
   * * 若其中元素是字符串类型，则模拟对象的 value 也是字符串，比如 {...{'userName': '测试userName1'}}。
   * * 若其中元素仍然是数组类型，则数组的第一个元素是字段名，字段值的类型分为三种情况：
   * * 1. 若该数组的第二个元素是 Boolean 类型，则生成的 value 为该 Boolean 值，比如 {...{'enabled': 'true'}}。
   * * 2. 若该数组第二个元素是特定字符串: 'number'，则生成的 value 为递增的 id 数字,比如 {...{'id': 100}}。
   * * 3. 若该数组的第二个元素是特定字符串: 'datetime'，则生成的 value 为基于当前时刻的 Date 对象。
   * * 4. 若该数组的第二个元素为数组 B ，则生成的 value 为一个模拟对象，
   * * * 子模拟对象将使用数组 B 作为配置，配置规则同上。(即通过递归调用 _getMockModel(key) 实现了嵌套结构。)
   */
  set(OPTION_OBJ: IOption): void {
    for (const key of Object.keys(OPTION_OBJ)) {
      this.data[key] = this._getMockModel(OPTION_OBJ[key]);
      console.log(`模拟变量[${key}]:`, this.data[key]);
    }
  }

  /** 在组件中需要模拟数据时调用，将返回一个对象数组
   *
   * @param key:string
   */
  get(key: string): Array<{[key: string]: any}> {
    return this.data[key];
  }

  /** 内部顶层函数，读取一个结构和 OPTIONS 相同的配置数组（不一定是顶层配置，也可以是嵌套的内部配置），
   * 返回一个相应的模拟对象数组（不一定是完整数据结构，可能是复杂结构中的一个子结构）。
   * @param option: Array，配置了希望模拟的数据结构，配置规则应和全局变量 OPTION_OBJ 相同
   */
  private _getMockModel(option: Array<any>): Array<Object> | Object {
    const lastElement = option[option.length - 1];
    if (isNaN(lastElement)) {
      return this._generateModelMock(option);
    } else {
      return this._generateModelMock(option, lastElement);
    }
  }

  /** 生成多条模拟信息，返回一个数组
   *
   * @param option :Array，关于数据结构的配置信息
   * @param n :number，期望生成 n 个同类对象组成的数组
   */
  private _generateModelMock(option: Array<any>, n: number = 12): Array<Object> | Object {
    const list = [];
    if (n === 1) {
      return this._generateModelFieldMock(option, 1);
    }

    for (let i = 1; i <= n; i++) {
      list.push(this._generateModelFieldMock(option, i));
    }
    return list;
  }

  /** 生成单条模拟信息
   * @param option:Array 配置信息，即单个对象的所有 key 组成的数组，详细规则见全局变量 OPTION_OBJ 的注释
   * @param i:number 测试文本末尾，用于区分同类对象的数字
   */
  private _generateModelFieldMock(option: Array<any>, i: number): Object {
    const length = option.length;
    const obj = {};
    for (let j = 0; j <= length - 1; j++) {
      if (VirtualDataGenerateService.isArray(option[j])) {
        if (option[j][1] === 'number') {
          obj[option[j][0]] = i;
        } else if (option[j][1] === 'datetime') {
          obj[option[j][0]] = new Date();
        } else if (VirtualDataGenerateService.isArray(option[j][1])) {
          obj[option[j][0]] = this._getMockModel(option[j][1]);
        } else {
          obj[option[j][0]] = option[j][1];
        }
      } else if (!isNaN(option[j])) {
      } else {
        obj[option[j]] = `测试${option[j]}${i}`;
      }
    }
    return obj;
  }
}
