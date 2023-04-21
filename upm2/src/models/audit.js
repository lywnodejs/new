import {
  fetchConfig,
  fetchApplyConfig,
  fetchAuditlog,
  fetchAuditApplyLog
} from '../services/audit';

export default {

  namespace: 'audit',

  state: {
    appId: '',
    config: {},
    applyConfig: {},
    auditlog: [],
    applyList: []
  },

  effects: {
    *fetchConfig({}, { call, put}) {
      const config = yield call(fetchConfig);

      yield put({
        type: 'update',
        payload: {
          config
        }
      })
    },
    *fetchApplyConfig({}, { call, put}) {
      const applyConfig = yield call(fetchApplyConfig);

      yield put({
        type: 'update',
        payload: {
          applyConfig
        }
      })
    },
    *fetchAuditlog({ payload }, { call, put}) {
      const {
        opName, opType, functionType,
        operationFunctionType, startTime,
        endTime, page, size, appId
      } = payload;
      
      const auditlog = yield call(fetchAuditlog, {
        opName, opType, functionType,
        operationFunctionType, startTime,
        endTime, page, size, appId
      });

      yield put({
        type: 'update',
        payload: {
          auditlog
        }
      })
    },
    *fetchAuditApplyLog({ payload }, { call, put}) {
      const {
        username, applyType, complete,
        status, createdAtStart,
        createdAtEnd, page, size, appId
      } = payload;
      
      const applyList = yield call(fetchAuditApplyLog, {
        username, applyType, complete,
        status, createdAtStart,
        createdAtEnd, page, size, appId
      });

      yield put({
        type: 'update',
        payload: {
          applyList
        }
      })
    }
  },

  reducers: {
    update(state, { payload }) {
      return { ...state, ...payload };
    }
  }
};