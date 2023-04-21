import {
  getCompleteRatio,
  getWeeklyReport,
  getLazyApplies,
  getRealTimeStats,
  getRankingListByApplyTime,
  getRankingListByComplete,
  getAppRank,
  getDeptRankListByComplete,
  getDeptRankingListByApplyTime,
  getOpsData,
  getRedundancyData,
  getRedundantRoles,
  downloadOpsStats,
  getApplyStat,
  getFlowData,
  getInfoDetails
} from '../services/dashboard';

export default {

  namespace: 'dashboard',

  state: {
    listByComplete: [],
    listByApplyTime: [],
    appRank: {},
    deptListByComplete: [],
    deptListByApplyTime: []
  },

  effects: {
    *getRealTimeStats ({ payload }, { call, put, take }) {
      if (!payload) {
        const takeAction = yield take('global/selectAvailableAppToManage');
        payload = takeAction.payload.appId;
      }

      return yield call(getRealTimeStats, { appId: payload });
    },
    *getOpsData ({ payload }, { call, put, take }) {
      let { appId } = payload;
      if (!appId) {
        const takeAction = yield take('global/selectAvailableAppToManage');
        appId = takeAction.payload.appId;
      }

      return yield call(getOpsData, {
        ...payload,
        appId
      });
    },
    *getRedundancyData ({ payload }, { call, put, take }) {
      let { appId } = payload;
      if (!appId) {
        const takeAction = yield take('global/selectAvailableAppToManage');
        appId = takeAction.payload.appId;
      }

      return yield call(getRedundancyData, {
        ...payload,
        appId
      });
    },
    *getRedundantRoles ({ payload }, { call, put, take }) {
      if (!payload) {
        const takeAction = yield take('global/selectAvailableAppToManage');
        payload = takeAction.payload.appId;
      }

      return yield call(getRedundantRoles, {
        appId: payload
      });
    },
    *downloadOpsStats ({ payload }, { call, put, take }) {
      let { appId } = payload;
      if (!appId) {
        const takeAction = yield take('global/selectAvailableAppToManage');
        appId = takeAction.payload.appId;
      }

      return yield call(downloadOpsStats, {
        ...payload,
        appId
      });
    },
    *getApplyStat ({ payload }, { call, put, take }) {
      let { appId } = payload;
      if (!appId) {
        const takeAction = yield take('global/selectAvailableAppToManage');
        appId = takeAction.payload.appId;
      }

      return yield call(getApplyStat, {
        ...payload,
        appId
      });
    },
    *getFlowData ({ payload }, { call, put, take }) {
      if (!payload) {
        const takeAction = yield take('global/selectAvailableAppToManage');
        appId = takeAction.payload.appId;
      }
      if (typeof payload === 'object') {
        if (!payload.appId) {
          const takeAction = yield take('global/selectAvailableAppToManage');
          payload.appId = takeAction.payload.appId;
        }
        return yield call(getFlowData, payload);
      }
      return yield call(getFlowData, {
        appId
      });
    },
    *getInfoDetails ({ payload }, { call, put, take }) {
      let { appId } = payload;
      if (!appId) {
        const takeAction = yield take('global/selectAvailableAppToManage');
        appId = takeAction.payload.appId;
      }

      return yield call(getInfoDetails, {
        ...payload,
        appId
      });
    },
    *getCompleteRatio ({ payload }, { call, put, take }) {
      if (!payload) {
        const takeAction = yield take('global/selectAvailableAppToManage');
        payload = takeAction.payload.appId;
      }

      return yield call(getCompleteRatio, {
        appId: payload
      });
    },
    *getWeeklyReport ({ payload }, { call, put, take }) {
      let { appId } = payload;
      if (!appId) {
        const takeAction = yield take('global/selectAvailableAppToManage');
        appId = takeAction.payload.appId;
      }

      return yield call(getWeeklyReport, {
        appId
      });
    },
    *getLazyApplies ({ payload }, { call, put, take }) {
      let { appId } = payload;
      if (!appId) {
        const takeAction = yield take('global/selectAvailableAppToManage');
        appId = takeAction.payload.appId;
      }

      return yield call(getLazyApplies, {
        appId
      });
    },
    *getRankingListByApplyTime ({ payload }, { call, put, take }) {
      const data = yield call(getRankingListByApplyTime);

      yield put({
        type: 'save',
        payload: {
          listByApplyTime: data
        }
      });
    },
    *getRankingListByComplete ({ payload }, { call, put, take }) {
      const data = yield call(getRankingListByComplete);

      yield put({
        type: 'save',
        payload: {
          listByComplete: data
        }
      });
    },
    *getAppRank ({ payload }, { call, put, take }) {
      let appId = payload;
      if (!appId) {
        const takeAction = yield take('global/selectAvailableAppToManage');
        appId = takeAction.payload.appId;
      }

      const data = yield call(getAppRank, { appId });

      yield put({
        type: 'save',
        payload: {
          appRank: data
        }
      });
    },
    *getDeptRankListByComplete ({ payload }, { call, put, take }) {
      const data = yield call(getDeptRankListByComplete);

      yield put({
        type: 'save',
        payload: {
          deptListByComplete: data
        }
      });
    },
    *getDeptRankingListByApplyTime ({ payload }, { call, put, take }) {
      const data = yield call(getDeptRankingListByApplyTime);

      yield put({
        type: 'save',
        payload: {
          deptListByApplyTime: data
        }
      });
    }
  },

  reducers: {
    save (state, action) {
      return { ...state, ...action.payload };
    }
  }
};
