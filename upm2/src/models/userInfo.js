/*
 * @Author: unknown
 * @Date: unknown
 * @LastEditors: GuoTeng
 * @LastEditTime: 2020-10-09 11:08:20
 */
/**
 * 用户本人信息
 */

import {
  getUserInfo,
  getUserGuide,
  postUserGuided,
  shouldDisplay
} from '../services/userInfo';

export default {
  namespace: 'userInfo',

  state: {
    introEntranceShow: false,
    introApplyNewShow: false
  },

  subscriptions: {
    setup({ dispatch }) {
      dispatch({
        type: 'fetch'
      }).then(userInfo => {
        typeof waterMark !== 'undefined' &&
          waterMark({
            systemId: 888,
            textStyle: 'rgba(0,0,0,0.05)',
            userId: userInfo.username
          });
      });
    }
  },

  effects: {
    *fetch(action, { call, put }) {
      const userInfo = yield call(getUserInfo);
      yield put({
        type: 'save',
        payload: userInfo
      });
      return userInfo;
    },
    *getUserGuide({ payload }, { call }) {
      return yield call(getUserGuide);
    },
    *postUserGuided({ payload }, { call }) {
      return yield call(postUserGuided);
    },
    *shouldDisplay({ payload }, { call, put }) {
      const introEntranceShow = yield call(shouldDisplay);
      yield put({
        type: 'save',
        payload: { introEntranceShow }
      });
      return introEntranceShow;
    }
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    }
  }
};
