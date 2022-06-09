import YAML from 'yaml';
import { readFileSync, writeFileSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';

/**
 * YAML 模块扩展
 */
declare module 'yaml' {
  export let readSync: (path: string) => unknown;
  export let read: (path: string) => Promise<unknown>;
  export let writeSync: (file: string, raw_data: any) => void;
  export let write: (file: string, raw_data: any) => Promise<void>;
}

/**
 * 异步读取 YAML 文件
 * 
 * @param path - 文件路径
 * @returns {Promise}
 */
YAML.read = async (path: string): Promise<unknown> => {
  try {
    const str = await readFile(path, 'utf8');
    return YAML.parse(str);
  } catch (error) {
    throw error;
  }
};

/**
 * 异步写入 YAML 文件
 * 
 * @param file - 文件路径
 * @param raw_data - object 源数据
 * @returns {Promise}
 */
YAML.write = (file: string, raw_data: any): Promise<void> => {
  const data = YAML.stringify(raw_data);
  return writeFile(file, data);
};

/**
 * 同步读取 YAML 文件
 * 
 * @param path - 文件路径
 * @returns {unknown}
 */
YAML.readSync = (path: string): unknown => {
  const str = readFileSync(path, 'utf8');
  return YAML.parse(str);
};

/**
 * 同步写入 YAML 文件
 * 
 * @param file - 文件路径
 * @param raw_data - object 源数据
 */
YAML.writeSync = (file: string, raw_data: any): void => {
  const data = YAML.stringify(raw_data);
  return writeFileSync(file, data);
};

export {
  YAML
}

/**
 * 校验 uin 合法性
 * 
 * @param {number} uin - 用户账号
 * @returns {boolean}
 */
export function checkUin(uin: number): boolean {
  return /[1-9][0-9]{4,10}/.test(uin.toString());
}

/**
 * 获取调用栈
 * 
 * @returns {Array}
 */
export function getStack(): NodeJS.CallSite[] {
  const orig = Error.prepareStackTrace;
  Error.prepareStackTrace = (_, stack) => stack;

  const stack: NodeJS.CallSite[] = new Error().stack as any;

  Error.prepareStackTrace = orig;
  return stack;
}

/**
 * 相同类型的对象深合并
 * 
 * @param {object} target - 目标 object
 * @param {object} sources - 源 object
 * @returns {object}
 */
export function deepMerge<T>(target: T, sources: T | undefined): T {
  const keys = Object.keys(sources ?? {});
  const keys_length = keys.length;

  for (let i = 0; i < keys_length; i++) {
    const key = keys[i];

    (<any>target)[key] = typeof (<any>target)[key] === 'object'
      ? deepMerge((<any>target)[key], (<any>sources)[key])
      : (<any>sources)[key];
  }
  return target;
}

/**
 * 对象深拷贝
 * 
 * @param {object} object - 拷贝 object
 * @returns {object}
 */
export function deepClone<T>(object: T): T {
  return JSON.parse(JSON.stringify(object));
}
