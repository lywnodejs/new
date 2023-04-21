import {
  getfeatureGroupList,
  createfeatureGroup,
  updatefeatureGroup,
  removefeatureGroup,
  getRelevantFeature,
  getRelevantRole,
  relevantFeature,
  relevantRole,
  fetchGroupRoleList,
  insertMutirole,
  fetchBindGroupRoleList
} from '../services/manageFeatureGroup';

const DEFAULT_FEATURE_GROUP = {
  id: '',
  name: '',
  pid: '',
  featureList: [],
  defaultCheckedRoles: [], // 功能组已绑定角色, 方法有待优化
  roleList: [],
  riskLevel: '',
  availableRiskLevel: ['C1', 'C2', 'C3', 'C4']
};

export default {

  namespace: 'featureGroup',

  state: {
    featureGroup: DEFAULT_FEATURE_GROUP,
    featureGroupList: {},
    roleList: [],
    groupBindRoles: []
  },

  subscriptions: {
    setup ({ dispatch, history }) {  // eslint-disable-line
    },
  },

  effects: {
    *fetchFeatureGroup ({ payload }, { call, put, take }) {  // eslint-disable-line

      // 同步获取appId
      let { appId } = payload;
      if (!appId) {
        const takeAction = yield take('global/selectAppToManage');
        appId = takeAction.payload.appId;
      }

      const featureGroupList = yield call(getfeatureGroupList, {
        ...payload,
        appId,
        size: 20
      });

      yield put({ type: 'saveFeatureGroupList', payload: featureGroupList });
    },
    

    *fetchRelevantFeature ({ payload }, { call, put }) {  // eslint-disable-line

      const featureList = yield call(getRelevantFeature, payload);

      yield put({
        type: 'mergeFeatureGroup',
        payload: {
          featureList
        }
      });
    },

    *fetchRelevantRole ({ payload }, { call, put }) {  // eslint-disable-line

      const roleList = yield call(getRelevantRole, payload);

      yield put({
        type: 'mergeFeatureGroup',
        payload: {
          roleList,
          defaultCheckedRoles: roleList
        }
      });
    },

    /**
     * 新增功能组
     * @param {*} param0
     * @param {*} param1
     */
    *createFeatureGroup ({ payload }, { call }) {
      // 服务器获取数据
      yield call(createfeatureGroup, payload);
    },

    /**
     * 删除功能组
     * @param {*} param0
     * @param {*} param1
     */
    *removeFeatureGroup ({ payload }, { call }) {
      // 服务器获取数据
      yield call(removefeatureGroup, payload);
    },

    /**
     * 更新功能组
     */
    *updateFeatureGroup ({ payload }, { call }) {

      yield call(updatefeatureGroup, payload);
    },

    *relevantRole ({ payload }, { call }) {
      yield call(relevantRole, payload);
    },

    *relevantFeature ({ payload }, { call }) {
      yield call(relevantFeature, payload);
    },
    *fetchGroupRoleList ({ payload }, { call, put }) {
      const roleList = yield call(fetchGroupRoleList, payload);

      yield put({
        type: 'save',
        payload: {
          roleList
        }
      });
    },
    *groupInsertMutirole ({ payload }, { call, put }) {
      yield call(insertMutirole, payload);
    },
    *fetchBindGroupRoleList ({ payload }, { call, put }) {
      const groupBindRoles = yield call(fetchBindGroupRoleList, payload);
      yield put({
        type: 'save',
        payload: {
          groupBindRoles
        }
      });
    }
  },

  reducers: {
    save (state, action) {
      return { ...state, ...action.payload };
    },
    saveFeatureGroupList (state, action) {
      return {
        ...state,
        featureGroupList: action.payload
      };
    },
    mergeFeatureGroup (state, { payload = DEFAULT_FEATURE_GROUP }) {
      return {
        ...state,
        featureGroup: {
          ...state.featureGroup,
          ...payload
        }
      };
    }
  },

};
