import {
   getDefaultAuthList, updateStatus,
   deleteAuth, getDept, getJobCode,
   addAuth, copyAuth, updateAuth,
} from '../services/manageDefaultAuth';
import { getRoleListAll } from '../services/role';
import { getFlagList } from '../services/manageFlags';
import { getAreaListAll } from '../services/area';
import { findIndex } from 'lodash';

export default {

  namespace: 'defaultauth',

  state: {
    modalStatus: 'ok',
    records: [],
    departments: [],
    jobs: [],
    roleList: [],
    flagList: [],
    areaList: [],
    current: 1,
    pages: 0,
  },

  subscriptions :{},

  effects: {
    *fetchList({ payload }, { call, put }) {
      const {
        appId, name = '', grantType = '',
        status = '', page = 1, size = 20,
      } = payload;
      const data = yield call(getDefaultAuthList, {
        appId,
        name,
        grantType,
        status,
        page,
        size,
      });
      yield put({
        type: 'save',
        payload: data,
      });      
    },

    *fetchDept({ payload }, { call, put }) {
      const { appId } = payload;
      const data = yield call(getDept, { appId });
      yield put({
        type: 'save',
        payload: {departments: data}
      });
    },

    *fetchJobCode({ payload }, { call, put }) {
      const { appId } = payload;
      const data = yield call(getJobCode, { appId });
      yield put({
        type: 'save',
        payload: {jobs: data}
      });
    },

    *fetchRoleList({ payload }, { call, put }) {
      const { appId } = payload;
      const data = yield call(getRoleListAll, { appId });
      yield put({
        type: 'save',
        payload: {roleList: data}
      });
    },

    *fetchFlagList({ payload }, { call, put }) {
      const { appId } = payload;
      const data = yield call(getFlagList, appId);
      yield put({
        type: 'save',
        payload: {flagList: data}
      });
    },

    *fetchAreaList({ payload }, { call, put }) {
      const { appId } = payload;
      const data = yield call(getAreaListAll, { appId });
      yield put({
        type: 'save',
        payload: {areaList: data}
      });
    },

    *updateStatus({ payload }, { call, put }) {
      yield call(updateStatus, payload);
      yield put({
        type: 'update',
        payload,
      });
    },

    *delete({ payload }, { call, put }) {
      const { appId, id } = payload;
      yield call(deleteAuth, { appId, id });
      yield put({
        type: 'fetchList',
        payload: { appId }
      });
    },

    *add({ payload }, { call, put }) {
      yield call(addAuth, payload);
      const { appId } = payload;
      yield put({
        type: 'fetchList',
        payload: { appId }
      });
    },

    *updateData({ payload }, { call, put }) {
      yield call(updateAuth, payload);
      const { appId } = payload;
      yield put({
        type: 'fetchList',
        payload: { appId }
      });
    },

    *copy({ payload }, { call, put }) {
      const { appId, id } = payload;
      yield call(copyAuth, { appId, id });
      yield put({
        type: 'fetchList',
        payload: { appId }
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
  }
};

