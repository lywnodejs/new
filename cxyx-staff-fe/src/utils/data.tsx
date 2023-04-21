import React from 'react';
import { baseHost } from './api/path';
import _ from 'lodash';
import { Select } from 'antd';
const path = require('path');
// PlainObject，值的类型是string
export interface PlainObjectWithStringValue {
  [key: string]: string;
}

export interface StringKeyWithObjectValue {
  [key: string]: string | object;
}

// 对json对象的值增加命名空间，比如：用于redux的action增加命名空间前缀防止action重名
export function addNamespacePrefix<T extends PlainObjectWithStringValue>(
  actionMap: T,
  namespace: string,
) {
  const res: PlainObjectWithStringValue = {};
  if (actionMap) {
    for (const key in actionMap) {
      res[key] = `${namespace}${actionMap[key]}(${_.uniqueId()})`;
    }
  }
  return res as T;
}

// 将 API 接口路径添加 baseHost 前缀
export function addBaseHostPrefix<T extends PlainObjectWithStringValue>(
  pathMap: T,
  host: string = baseHost,
) {
  const res: PlainObjectWithStringValue = {};
  if (pathMap) {
    for (const key in pathMap) {
      res[key] = '/' + path.join(host, pathMap[key]);
    }
  }
  return res as T;
}

/**
 * 使常量 Map 正向反向查找更易用，方便 key 查找
 * @param map
 * @param keyName
 * @param valueName
 * 推荐使用方式：
 let COMPLETE_STATUS_MAP =
 {
    INCOMPLETE: {
      key: 0,
      name: '未完成',
    },
    COMPLETED: {
      key: 1,
      name: '完成',
    },
  };
 COMPLETE_STATUS_MAP = easyConstMap(COMPLETE_STATUS_MAP, 'key', 'name');
 */
export function easyConstMap<T extends StringKeyWithObjectValue>(
  map: T,
  keyName = 'key',
  valueName = 'name',
) {
  const newMap = {};
  for (const key in map) {
    newMap[map[key][keyName]] = map[key][valueName];
  }
  return { ...map, ...newMap } as T;
}

/**
 * 将 map 转换为下拉选项
 * @param map, 兼容 easyConstMap、普通 map、普通数组
 * @param keyName
 * @param valueName
 */
export function renderOptionsByMap(
  map,
  keyName = 'key',
  valueName = 'name',
  props?,
  otherOption?,
) {
  const options = [];
  const { needSourse } = otherOption || {};
  for (const key in map) {
    if (typeof map[key] === 'object') {
      const option = { label: map[key][valueName], value: map[key][keyName] };
      if (needSourse) {
        option['sourse'] = map[key];
      }
      options.push(option);
    }
  }
  return (
    <Select
      allowClear
      showSearch
      style={{ minWidth: 100 }}
      placeholder={'请选择'}
      optionFilterProp="label"
      options={options}
      {...props}
    />
  );
}

/**
 * 参数对象转为 GET 形式的 URL
 * @param obj
 */
export function formatGetURL(obj) {
  let getParams = '';
  for (const key in obj) {
    obj[key] && (getParams += `&${key}=${obj[key]}`);
  }
  return getParams;
}

/**
 *
 * @param map
 * @param keyName
 * @param valueName
 */
export function easyConstMapReverse(map, keyName, valueName) {
  const result = {};
  for (const key in map) {
    result[map[key][keyName]] = map[key][valueName];
  }
  return result;
}
