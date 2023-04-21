import {
  getWorkflowList, getWorkflowListOld, updateFlow, configFlow, deleteFlow, newFlow, unbindFlow,
  getAllBusniss, getAllArea, getAllRole, getAllRolegroup, getAllFlag,getWorkflowInfo
} from '../services/workflow';
import { findIndex } from 'lodash';

const updateStatus = (status) => {
  return {
    type: 'save',
    payload: {
      modalStatus: status
    }
  };
};

export default {

  namespace: 'workflow',

  state: {
    modalStatus: 'ok', // enum: ['ok', 'error', 'loading']
    current: 1,
    pages: 0,
    records:[],
    size: 20,
    total: 0,
    options: {}, // key[appId], value[{[optionsKey: records]}]
    workflowInfo: null
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      const { page } = payload;
      let data = yield call(getWorkflowList, Object.assign(payload, {
        page: page || 1,
        size: 20
      }));
      if (!data) {
        data = [];
      }
      if (data instanceof Array) {
        data = {
          records: data,
          // current: 1,
          // pages: 0,
          // size: 20,
          // total: 0,
        }
      }
      yield put({
        type: 'save',
        payload: data
      });
    },
    *fetchOld({ payload }, { call, put }) {  // eslint-disable-line
      const { page } = payload;
      const data = yield call(getWorkflowListOld, Object.assign(payload, {
        page: page || 1,
        size: 20
      }));
      yield put({
        type: 'save',
        payload: data
      });
    },
    *newFlow({ payload }, { call, put }) {
      yield put(updateStatus('loading'));
      try {
        yield call(newFlow, payload);

        yield put(updateStatus('ok'));

        const { appId } = payload;
        yield put({
          type: 'fetchOld',
          payload: {
            appId
          }
        });
      } catch (err) {
        yield put(updateStatus('error'));

        throw err;
      }
    },
    *updateFlow({ payload }, { call, put }) {
      yield put(updateStatus('loading'));
      try {
        yield call(updateFlow, payload);

        yield put(updateStatus('ok'));

        yield put({
          type: 'update',
          payload
        });
      } catch (err) {
        yield put(updateStatus('error'));

        throw err;
      }
    },
    *configFlow({ payload }, { call, put }) {
      yield put(updateStatus('loading'));
      try {
        yield call(configFlow, payload);

        yield put(updateStatus('ok'));

        yield put({
          type: 'update',
          payload
        });
      } catch (err) {
        yield put(updateStatus('error'));

        throw err;
      }
    },
    *delFlow({ payload: { id, appId } }, { call, put }) {
      yield call(deleteFlow, {
        appId,
        ids: [id]
      });

      yield put({
        type: 'fetchOld',
        payload: {
          appId
        }
      });
    },
    *unbindFlow({ payload: { id, appId } }, { call, put }) {
      yield call(unbindFlow, {
        appId,
        id
      });

      yield put({
        type: 'fetchOld',
        payload: {
          appId
        }
      });
    },
    *fetchOptions({ payload: { appId, type } }, { call, put, select }) {
      let options = yield select((state) => state.workflow.options[appId]);

      if (options && options[type]) {
        return;
      }

      let newOptions = options ? options : {};
      // 根据appId 和 type 判断是否已存储需要的信息
      switch (type) {
        case '3':
          newOptions[type] = yield call(getAllBusniss, { appId });
          break;
        case '2':
          newOptions[type] = yield call(getAllRole, { appId });
          break;
        case '1':
          newOptions[type] = yield call(getAllRolegroup, { appId });
          break;
        case '4':
          newOptions[type] = yield call(getAllArea, { appId });
          break;
        case '5':
          newOptions[type] = yield call(getAllFlag, { appId });
          break;
        default:
          newOptions[type] = [{
            id: 0,
            nameZh: '全部'
          }];
      }

      yield put({
        type: 'updateOptions',
        payload: {
          [appId]: newOptions
        }
      });
    },
    *getWorkflowInfo({payload},{call,put}) {
      let response = yield call(getWorkflowInfo,payload);
      yield put({
        type: 'save',
        payload: {
          workflowInfo: JSON.parse(response)
        }
      })
    }
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    update(state, { payload }) {
      const { id, ...others } = payload;
      const recordIndex = findIndex(state.records, ['id', id]);

      const newRecord = {
        ...state.records[recordIndex],
        ...others,
      };

      state.records.splice(recordIndex, 1, newRecord);

      return { ...state };
    },
    updateOptions(state, { payload }) {
      const { options } = state;

      return {
        ...state,
        options: {
          ...options,
          ...payload
        }
      };
    }
  },

};
