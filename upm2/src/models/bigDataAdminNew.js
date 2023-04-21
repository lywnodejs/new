import {
  getWorkflowList, updateFlow, deleteFlow, newFlow,
  getAllBusniss, getAllArea, getAllRole, getAllRolegroup, getAllFlag
} from '../services/workflow'; // TODO: need remove

import {
  getAvailableBusiness,
  getAdminList,
  delAdmin,
  addAdmin
} from '../services/bigData';

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

  namespace: 'bigDataAdmin',

  state: {
    current: 1,
    records:[],
    size: 10,
    total: 0,
    // availableBusinessList: []
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },

  effects: {
    *getAvailableBusiness(action, { call, put, select }) {
      const appId = yield select((state) => state.global.managingApp);
      const availableBusinessList = yield call(getAvailableBusiness, appId);

      yield put({
        type: 'save',
        payload: {
          availableBusinessList
        }
      });
    },
    *fetch({ payload }, { call, put, select }) {  // eslint-disable-line
      const { size } = yield select((state) => state.bigDataAdmin);

      const { page=1, businessId, name, appId } = payload;
      const {
        records,
        current,
        total
      } = yield call(getAdminList, {
        page,
        size,
        businessId,
        name,
        appId
      });

      yield put({
        type: 'save',
        payload: {
          records,
          current,
          total,
        }
      });
    },

    *addAdmin({ payload }, { call  }) {
      yield call(addAdmin, payload);
    },

    *delAdmin({ payload }, { call, select, put }) {
      yield call(delAdmin, payload);

      const records = yield select((state) => state.bigDataAdmin.records);

      const filtered = records.filter(record => record.id !== payload.id);

      yield put({
        type: 'save',
        payload: {
          records: [...filtered]
        }
      });
    },
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
