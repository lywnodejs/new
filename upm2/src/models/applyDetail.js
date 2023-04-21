/*
 * @Author: GuoTeng
 * @Date: 2020-07-07 16:33:30
 * @LastEditors: GuoTeng
 * @LastEditTime: 2020-10-19 14:18:16
 */

import {
  fetchApplyDetail,
  fetchApplyWorkflow,
} from '../services/apply';

export default {

  namespace: 'applyDetail',

  state: {
    // 申请详情
    detail: {}
  },

  effects: {
    *fetch({ payload }, { call, put, take }) {
      const { applyId } = payload;

      const detail = yield call(fetchApplyDetail, applyId);
      yield put({
        type: 'save',
        payload: {
          detail,
          // workflow,
        },
      });
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

};
