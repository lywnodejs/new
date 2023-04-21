import { routerRedux } from 'dva/router';
import {
  getUserList,
  getBusnessLineList,
  getUserInfo,
  copyGroups
} from '../services/monitorDataUser';

export default {
  namespace: 'monitorDataUser',

  state: {
    members: [],
    busnessLines: []
  },

  effects: {
    *redirect({ payload: { path }}, { put }) {
      yield put(routerRedux.push(path));
    },
    *fetchMembers({ payload }, { call, put }) {
      const res = yield call(getUserList);
      const action = {
        type: 'save',
        payload: {
          members: res.data
        }
      };
      yield put(action);
      return res.data;
    },
    *fetchBusnessLineList({ payload }, { call, put }) {
      const res = yield call(getBusnessLineList);
      const action = {
        type: 'save',
        payload: {
          busnessLines: res.data
        }
      };
      yield put(action);
    },
    *fetchUserInfo({ payload: { username} }, { call, put }) {
      const res = yield call(getUserInfo, username);
      return res.data;
    },
    *copyGroups({ payload: { usernames, expireAt, reason, groups } }, { call }) {
      const res = yield call(copyGroups, { usernames, expireAt, reason, groups });
      return res.data
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload
      };
    }
  }
}
