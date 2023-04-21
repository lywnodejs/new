import _ from 'lodash';
const tableParamMap = {}; // 存储每个 table 的参数
const tableWatchMap = {}; // 存储每个 table 的回调函数
let hiddenColumnMap = {}; // 存储每个 table 的自定义隐藏的列

// 默认页码参数配置
const DEFAULT_PAGE_PARAMS = {
  page: 1,
  size: 10,
};

// 获取表格参数
const getTableParams = (tableName: string) => {
  return tableParamMap[tableName] || DEFAULT_PAGE_PARAMS;
};

// 获取页码参数
const getPageParams = (tableName: string) => {
  return {
    page: _.get(tableParamMap, `${tableName}.page`, DEFAULT_PAGE_PARAMS.page),
    size: _.get(tableParamMap, `${tableName}.size`, DEFAULT_PAGE_PARAMS.size),
  };
};

// 添加表格查询条件，任意字段，保留之前字段
const addTableParams = (params, tableName: string, doWatch?: boolean) => {
  const lastParams = getTableParams(tableName);
  writeTableParams({ ...lastParams, ...params }, tableName, doWatch);
};

// 修改表格查询条件，带默认页码参数
const setTableParams = (params, tableName: string, doWatch?: boolean) => {
  writeTableParams(
    { ...getPageParams(tableName), ...params },
    tableName,
    doWatch,
  );
};

// 修改表格查询条件，任意字段
const writeTableParams = (params, tableName: string, doWatch?: boolean) => {
  tableParamMap[tableName] = params;
  if (doWatch ?? true) {
    for (const key in tableWatchMap[tableName]) {
      if ('function' === typeof tableWatchMap[tableName][key]) {
        tableWatchMap[tableName][key](params);
      }
    }
  }
};

// 观察者模式，参数变化则触发回调
const watchTableParams = (callback: Function, tableName: string) => {
  if (tableWatchMap[tableName]) {
    let includedFunction = false;
    tableWatchMap[tableName].forEach((item, index) => {
      if (item.toString() === callback.toString()) {
        includedFunction = true;
      }
      if (includedFunction) {
        tableWatchMap[tableName][index] = callback;
      } else {
        tableWatchMap[tableName].push(callback);
      }
    });
  } else {
    tableWatchMap[tableName] = [callback];
  }
};

// 获取自定义列
const getHiddenColumn = (columns, tableName: string) => {
  if (_.isEmpty(hiddenColumnMap)) {
    try {
      hiddenColumnMap = JSON.parse(
        localStorage.getItem('hiddenColumnMap') || '{}',
      );
    } catch (e) {
      console.error(e);
    }
  }
  const hiddenColumns = hiddenColumnMap[tableName];
  if (Array.isArray(hiddenColumns) && hiddenColumns.length > 0) {
    columns.forEach(item => {
      if (hiddenColumns.includes(item['dataIndex'])) {
        item.hidden = true;
      } else {
        item.hidden = false;
      }
    });
  }
  return columns;
};

// 设置自定义列
const setHiddenColumn = (columns, tableName: string) => {
  try {
    hiddenColumnMap = JSON.parse(
      localStorage.getItem('hiddenColumnMap') || '{}',
    );
    hiddenColumnMap[tableName] = columns;
    localStorage.setItem('hiddenColumnMap', JSON.stringify(hiddenColumnMap));
  } catch (e) {
    console.error(e);
  }
};

export {
  getTableParams,
  setTableParams,
  addTableParams,
  watchTableParams,
  getHiddenColumn,
  setHiddenColumn,
};
