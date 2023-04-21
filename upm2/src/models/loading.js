// 全局的loading状态载体
// 所有的请求loading状态更新 在这里控制

import _ from 'lodash';

const getLoadingMap = (fields, flag) => {
  const loadingMap = {};
  _.each(fields, (field, namespace) => {
    loadingMap[namespace] = loadingMap[namespace] || {};
    loadingMap[namespace][field] = flag;
  });

  return loadingMap;
};

export default {

  namespace: 'loading',

  state: {
    /*
    namespace1: {
      list1: true,
      table2: false,
      img3: true,
    }
    */
  },

  subscriptions: {},

  effects: {
    // loading开始
    *start({ payload }, { put }) {
      yield put({
        type: 'save',
        payload: getLoadingMap(payload, true),
      });
    },
    // loading结束
    *end({ payload }, { put }) {
      yield put({
        type: 'save',
        payload: getLoadingMap(payload, false),
      });
    },
  },

  reducers: {
    save(state, { payload }) {
      const newState = { ...state };
      _.each(payload, (fields, namespace) => {
        newState[namespace] = {
          ...newState[namespace],
          ...fields,
        };
      });
      return newState;
    },
  },

};
