/*
 * @Author: GuoTeng
 * @Date: 2020-08-06 14:29:20
 * @LastEditors: GuoTeng
 * @LastEditTime: 2020-09-22 17:25:02
 */
import _ from 'lodash';
import { getMyMenus } from '../../services/menus';

const defaultState = [];
const namespace = 'menus';

export default {
  namespace,

  state: defaultState,

  subscriptions: {},

  effects: {
    *fetchMyMenus({ payload = {} }, { call, put, select }) {
      let { appId } = payload;
      // 如果action里没有传appId，则从store里取
      if (_.isUndefined(appId)) {
        appId = yield select(state => state.global.managingApp);
      }

      // if (!_.isUndefined(appId)) {
      const myMenus = yield call(getMyMenus, {
        appId: appId || 888
      });
      yield put({ type: 'save', payload: myMenus });
      // }
    }
  },

  reducers: {
    save(state, action) {
      return action.payload;
    }
  }
};
