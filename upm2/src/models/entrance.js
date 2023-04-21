/**
 * 用户（普通用户、管理员）的首页
 */

import { getApplyList } from '../services/apply';
import { getApprove } from '../services/approve';
import {
  fetchDataChanged,
  fetchDataApplying,
  fetchDataExpiring,
  fetchDataExpired,
  fetchData2Approve,
  fetchData2Review,
  fetchDataManage,
  fetchDataTeam,
  fetchModules
} from '../services/home';
import {
  fetchPermissionCount,
  fetchPermissionOtherCount
} from '../services/permissionList';
import { MAIN } from '@routes/config';

// 不显示systemlist的黑名单
// const BLACK_LIST = [MAIN, MAIN + '/newapply', MAIN + '/tools'];

export default {
  namespace: 'entrance',

  state: {
    apply: {},
    approve: {},
    permission: {},
    otherpermission: {},
    dataApplying: {},
    dataExpiring: {},
    dataExpired: {},
    dataChanged: {},
    dataApprove: {},
    dataReview: {},
    dataManage: {},
    dataTeam: {},
    modules: [],
    //首页-引导页相关
    maskVisible: false,
    preIntroVisible: false,
    postIntroVisible: false
  },

  // subscriptions: {
  //   // setup({ dispatch }) {
  //   //   dispatch({ type: 'fetchApply' });
  //   //   dispatch({ type: 'fetchApprove' });
  //   // },
  //   setup({ dispatch, history }) {
  //     history.listen(({ pathname }) => {
  //       dispatch({ type: 'global/updateShowSystemList', payload: {showSystemList: BLACK_LIST.indexOf(pathname) < 0 } });
  //     });
  //   }
  // },

  effects: {
    *fetchApply(action, { call, put }) {
      const apply = yield call(getApplyList, {
        size: 10
      });

      yield put({
        type: 'save',
        payload: { apply }
        // payload: { apply: apply.records },
      });
    },
    *fetchApprove(action, { call, put }) {
      const approve = yield call(getApprove, {
        size: 10
      });

      yield put({
        type: 'save',
        payload: { approve }
      });
    },
    *fetchPermission({ payload }, { call, put }) {
      const permission = yield call(fetchPermissionCount, payload);

      yield put({
        type: 'save',
        payload: { permission }
      });
    },
    *fetchOtherPermission({ payload }, { call, put }) {
      const otherpermission = yield call(fetchPermissionOtherCount, {
        who: payload.who
      });

      yield put({
        type: 'save',
        payload: { otherpermission }
      });
    },
    *fetchDataApplying({ payload }, { call, put }) {
      const dataApplying = yield call(fetchDataApplying);

      yield put({
        type: 'save',
        payload: { dataApplying }
      });
    },
    *fetchDataExpiring({ payload }, { call, put }) {
      const dataExpiring = yield call(fetchDataExpiring);

      yield put({
        type: 'save',
        payload: { dataExpiring }
      });
    },
    *fetchDataExpired({ payload }, { call, put }) {
      const dataExpired = yield call(fetchDataExpired);

      yield put({
        type: 'save',
        payload: { dataExpired }
      });
    },
    *fetchDataChanged({ payload }, { call, put }) {
      const dataChanged = yield call(fetchDataChanged);

      yield put({
        type: 'save',
        payload: { dataChanged }
      });
    },
    *fetchData2Approve({ payload }, { call, put }) {
      const dataApprove = yield call(fetchData2Approve);

      yield put({
        type: 'save',
        payload: { dataApprove }
      });

      return dataApprove;
    },
    *fetchData2Review({ payload }, { call, put }) {
      const dataReview = yield call(fetchData2Review);

      yield put({
        type: 'save',
        payload: { dataReview }
      });
    },
    *fetchDataManage({ payload }, { call, take, put }) {
      // 同步获取appId
      let { appId } = payload;
      if (!appId) {
        const takeAction = yield take('global/selectAppToManage');
        appId = takeAction.payload.appId;
      }

      const dataManage = yield call(fetchDataManage, { appId });

      yield put({
        type: 'save',
        payload: { dataManage }
      });
    },
    *fetchDataTeam({ payload }, { call, put }) {
      const dataTeam = yield call(fetchDataTeam);

      yield put({
        type: 'save',
        payload: { dataTeam }
      });
    },
    *fetchModules({ payload }, { call, put }) {
      const modules = yield call(fetchModules);

      yield put({
        type: 'save',
        payload: { modules }
      });
    }
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    }
  }
};
