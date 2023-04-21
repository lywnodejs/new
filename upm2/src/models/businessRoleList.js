import {
    getBusisnessRoleList,
    deleteBussisnessRole,
    addBussisnessRole,
    editBussisnessRole,
    roleBindResource,
    roleUnBindResource,
    queryUserName,
    getRoleBindUsers,
    getBusinessResourceList,
    getBusinessAreaList,
    getResourceBindRoleList,
    getResourceBindUserList,
    getAreaBindUserList
} from '../services/businessManage';

const PAGE_SIZE = 10;

export default {

  namespace: 'businessRoleList',

  state: {
    list: {
      records: [],
      current: 1,
      total: 0,
      size: PAGE_SIZE,
      loading: false
    },
    bindUsers: {
      records: [],
      current: 1,
      total: 0,
      size: 5,
      loading: false
    },
    businessResourceList: {
      records: [],
      current: 1,
      total: 0,
      size: PAGE_SIZE,
      loading: false
    },
    businessAreaList: {
      records: [],
      current: 1,
      total: 0,
      size: PAGE_SIZE,
      loading: false
    },
    resourceBindRoleList: {
      records: [],
      current: 1,
      total: 0,
      size: 5,
      loading: false
    },
    resourceBindUserList: {
      records: [],
      current: 1,
      total: 0,
      size: 5,
      loading: false
    }
  },
  effects: {
    *fetchBusinessRoleList({ payload }, { call, put, select }) {  // eslint-disable-line
      // 同步获取appId
      
      let { appId } = payload;
      if (appId === undefined) {
        appId = select(state => state.global.appId);
      }
      yield put({
        type: 'updateBusinessRoleList',
        payload: {
          loading: true
        }
      });
      const roleList = yield call(getBusisnessRoleList, {
        ...payload,
        size: PAGE_SIZE,
        appId
      });
      yield put({
        type: 'updateBusinessRoleList',
        payload: {
          current: payload.page,
          records: roleList.records,
          total: roleList.total,
          loading: false
        }
      });
    },
    *removeRole({ payload }, { call, select }) {
      let { appId } = payload;
      if (!appId) {
        appId = yield select(state => state.global.appId);
      }
      yield call(deleteBussisnessRole, {
        ...payload,
        appId
      });
    },
    *addRole({payload}, {call, select}) {
      let { appId } = payload;
      if (!appId) {
        appId = yield select(state => state.global.appId);
      }
      yield call(addBussisnessRole, {
        ...payload,
        appId
      });
    },
    *editRole({payload}, {call, select}) {
      let { appId } = payload;
      if (!appId) {
        appId = yield select(state => state.global.appId);
      }
      yield call(editBussisnessRole, {
        ...payload,
        appId
      });
    },
    *roleBindResource({payload}, {call, select}) {
      let { appId } = payload;
      if (!appId) {
        appId = yield select(state => state.global.appId);
      }
      yield call(roleBindResource, {
        ...payload,
        appId
      });
    },
    *roleUnBindResource({payload}, {call, select}) {
      let { appId } = payload;
      if (!appId) {
        appId = yield select(state => state.global.appId);
      }
      yield call(roleUnBindResource, {
        ...payload,
        appId
      });
    },
    *queryUserName({payload}, {call}) {
      yield call(queryUserName, {
        ...payload
      });
    },
    *getRoleBindUsers({payload}, {call, put, select}) {
      yield put({
        type: 'updateRolebindUsers',
        payload: {
          loading: true
        }
      });
      let users = yield call(getRoleBindUsers, {
        ...payload
      });
      yield put({
        type: 'updateRolebindUsers',
        payload: {
          current: payload.page,
          records: users.records,
          total: users.total,
          loading: false
        }
      });
      yield put({
        type: 'updateRolebindUsers',
        payload: {
          current: payload.page,
          records: users.records,
          total: users.total,
          loading: false
        }
      });
      yield put({
        type: 'updateResourceBindUserList',
        payload: {
          current: payload.page,
          records: users.records,
          total: users.total,
          loading: false
        }
      });
    },
    *fetchBusinessResourceList({ payload }, {call, put}) {
      yield put({
        type: 'updateBusinessResourceList',
        payload: {
          loading: true
        }
      });
      const data = yield call(getBusinessResourceList, {
        size: PAGE_SIZE,
        ...payload
      })
      yield put({
        type: 'updateBusinessResourceList',
        payload: {
          ...data,
          loading: false
        }
      });
    },
    *fetchBusinessAreaList({ payload }, {call, put}) {
      yield put({
        type: 'updateBusinessAreaList',
        payload: {
          loading: true
        }
      });
      const data = yield call(getBusinessAreaList, {
        size: PAGE_SIZE,
        ...payload
      })
      yield put({
        type: 'updateBusinessAreaList',
        payload: {
          ...data,
          loading: false
        }
      });
    },
    *fetchResourceBindRoleList({ payload }, {call, put}) {
      yield put({
        type: 'updateResourceBindRoleList',
        payload: {
          loading: true
        }
      });
      const data = yield call(getResourceBindRoleList, {
        size: 5,
        ...payload
      })
      yield put({
        type: 'updateResourceBindRoleList',
        payload: {
          ...data,
          loading: false
        }
      });
    },
    *fetchResourceBindUserList({ payload }, {call, put}) {
      yield put({
        type: 'updateResourceBindUserList',
        payload: {
          loading: true
        }
      });
      const data = yield call(getResourceBindUserList, {
        size: 5,
        ...payload
      })
      yield put({
        type: 'updateResourceBindUserList',
        payload: {
          ...data,
          loading: false
        }
      });
    },
    *fetchAreaBindUserList({ payload }, {call, put}) {
      yield put({
        type: 'updateResourceBindUserList',
        payload: {
          loading: true
        }
      });
      const data = yield call(getAreaBindUserList, {
        size: 5,
        ...payload
      })
      yield put({
        type: 'updateResourceBindUserList',
        payload: {
          ...data,
          loading: false
        }
      });
    },
  },

  reducers: {
    updateBusinessAreaList(state, { payload }) {
      return {
        ...state,
        businessAreaList: {
          ...state.businessAreaList,
          ...payload
        }
      };
    },
    updateBusinessResourceList(state, { payload }) {
      return {
        ...state,
        businessResourceList: {
          ...state.businessResourceList,
          ...payload
        }
      };
    },
    updateRoleModel(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    },
    updateBusinessRoleList(state, { payload }) {
      return {
        ...state,
        list: {
          ...state.list,
          ...payload
        }
      };
    },
    updateRolebindUsers(state, { payload }) {
      return {
        ...state,
        bindUsers: {
          ...state.bindUsers,
          ...payload
        }
      }
    },
    updateResourceBindRoleList(state, { payload }) {
      return {
        ...state,
        resourceBindRoleList: {
          ...state.resourceBindRoleList,
          ...payload
        }
      }
    },
    updateResourceBindUserList(state, { payload }) {
      return {
        ...state,
        resourceBindUserList: {
          ...state.resourceBindUserList,
          ...payload
        },
        // bindUsers: {
        //   ...state.bindUsers,
        //   ...payload
        // }
      }
    }
  }
};
