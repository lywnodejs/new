import {
  queryLog,
  logSetting
} from '../services/oplog';

export default {
  namespace: 'oplog',

  state: {},

  effects: {
    * queryLog({
      payload
    }, {
      call,
      put,
      take
    }) {
      let { appId } = payload;
      if (!appId) {
        const takeAction = yield take('global/selectAppToManage');
        appId = takeAction.payload.appId;
      }

      return yield call(queryLog, {
        ...payload,
        appId
      });
    },
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
