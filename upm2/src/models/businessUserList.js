import {
    getBusisnessUserList,
    userBindResource,
    userUnBindResource
} from '../services/businessManage';

const PAGE_SIZE = 20;

export default {

  namespace: 'businessUserList',

  state: {
    list: {
      records: [],
      current: 1,
      total: 0,
      size: PAGE_SIZE,    
      loading: false
    },
    bindRoles: {
      records: [],
      current: 1,
      total: 0,
      size: 5,
      loading: false
    }
  },
  effects: {
    *fetchBusinessUserList({ payload }, { call, put, select }) {  // eslint-disable-line
      // 同步获取appId
      let { appId } = payload;
      if (!appId) {
        appId = select(state => state.global.appId);
      }
      yield put({
        type: 'updateBusinessUserList',
        payload: {
          loading: true
        }
      });
      const roleList = yield call(getBusisnessUserList, {
        ...payload,
        size: PAGE_SIZE,
        appId
      });
      yield put({
        type: 'updateBusinessUserList',
        payload: {
          current: payload.page,
          records: roleList.records,
          total: roleList.total,
          loading: false
        }
      });
    },
    *userBindResource({payload}, {call, select}) {
      let { appId } = payload;
      if (!appId) {
        appId = yield select(state => state.global.appId);
      }
      return yield call(userBindResource, {
        ...payload,
        appId
      });
    },
    *userUnBindResource({payload}, {call, select}) {
      let { appId } = payload;
      if (!appId) {
        appId = yield select(state => state.global.appId);
      }
      yield call(userUnBindResource, {
        ...payload,
        appId
      });
    },
  },

  reducers: {
    updateUserModel(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    },
    updateBusinessUserList(state, { payload }) {
      return {
        ...state,
        list: {
          ...state.list,
          ...payload
        }
      };
    }
  }
};
