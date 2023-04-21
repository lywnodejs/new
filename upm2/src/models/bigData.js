import {
  fetchResourceType, fetchResource,
  addUser, updateUser, deleteUser, fetchBusinessLine, getPermissionNames
} from '../services/bigData';

export default {

  namespace: 'bigData',

  state: {
    businessLine: [],
    resourceType: [],
    resource: [],
    appIdNames: []
  },

  subscriptions: {

  },

  effects: {
    *getPermissionNames({ payload }, { call, put }){
      const { appIds } = payload;
      const appIdNames = yield call(getPermissionNames, appIds);

      yield put({
        type: 'save',
        payload: { appIdNames }
      })
    },

    *fetchBusinessLine({ payload }, { call, put }) {
      const { appId  } = payload;
      const businessLine = yield call(fetchBusinessLine, { appId });
      yield put({
        type: 'save',
        payload: { businessLine }
      });
    },

    *fetchResourceType({ payload }, { call, put }) {
      const { appId  } = payload;
      const resourceType = yield call(fetchResourceType, { appId });
      yield put({
        type: 'save',
        payload: { resourceType }
      });
    },

    *fetchResource({ payload }, { call, put }) {
      const { 
        page = 1, size = 10, appId = 1182,
        businessId = '', typeId = '', resourceName = '', 
        resourceKey = '', username = ''
      } = payload;
      const resource =  yield call(fetchResource, {
        page, size, appId,
        businessId, typeId, resourceName,
        resourceKey, username
      });
      yield put({
        type: 'save',
        payload: { resource }
      });
    },

    *addUser({ payload }, { call }) {
      const { 
        page = 1, size = 20, appId = 1182,
        businessId = '', typeId = '', resourceName = '', 
        resourceKey = '', username = ''
      } = payload;
      yield call(addUser, {
        page, size, appId,
        businessId, typeId, resourceName,
        resourceKey, username
      });
    },

    *updateUser({ payload }, { call }) {
      const { 
        id, appId = 1182, businessId = '', typeId = '',
        resourceName = '', resourceKey = '', username = ''
      } = payload;
      yield call(updateUser, {
        id, appId, businessId, typeId,
        resourceName, resourceKey, username
      });
    },

    *deleteUser({ payload }, { call }) {
      const { appId = 1182, id } = payload;
      yield call(deleteUser, { appId, id });
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    }
  }
};