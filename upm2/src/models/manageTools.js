/**
 * 系统管理-管理员工具 models
 * @author lizhenghua
 * @date 2018-08-16 14:38:43
 */

import {
  getCacheByKey,
  setCacheByKey,
  deleteCacheByKey
} from '../services/manageTools';

export default {

  namespace: 'manageTools',

  state: {
    listdatas: []
  },

  effects: {
    *search({ payload: {key} }, { call, put }) {
      let listdatas = yield call(getCacheByKey, key);

      // if (Object.prototype.toString.apply(listdatas) === '[object String]') {
      //   listdatas = JSON.parse(listdatas);
      // }
      if (Object.prototype.toString.apply(listdatas) === '[object String]') {
        listdatas = [{ data: listdatas }];
      }
      yield put({
        type: 'save',
        payload: {
          listdatas
        },
      });
    },

    *edit({ payload: {key, cacheValue} }, {call, put}) {
      yield call(setCacheByKey, key, cacheValue);
    },

    *delete({ payload: {key} }, { call, put }) {
      yield call(deleteCacheByKey, key);
      // console.log(key);
      // let result = yield call(deleteCacheByKey, key);

      // yield put({
      //   type: 'delete',
      //   payload: {
      //     applyId
      //   }
      // });
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        listdatas: action.payload
      };
    },
    // delete(state, { payload }) {
    //   const { listdatas } = state;

    //   return {
    //     ...state,
    //     listdatas: listdatas.filter((item) => item.id !== payload.applyId)
    //   };
    // },
  }
}