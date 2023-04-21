import {
  getStrategyList,
  getStrategy,
  getTypeList,
  getTypeListAll,
  createStrategy,
  updateStrategy,
  removeStrategy,
  createType,
  updateType,
  removeType
} from '../services/strategy';

// 默认角色策略
const DEFAULT_STRATEGY = {
  id: 0,
  appId: 0,
  roleId: '',
  relationId: '',
  strategyName: '',
  strategyKey: '',
  creator: '',
  createdAt: null,
  tagList: [{
    tagId: '',
    dimeIds: []
  }]
};

// 默认策略类型
const DEFAULT_STRATEGY_TYPE = {
  id: 0,
  appId: 0,
  system: '',
  tagName: '',
  tagKey: '',
  description: '',
  creator: '',
  createdAt: null
};

export default {

  namespace: 'strategy',

  state: {
    strategy: DEFAULT_STRATEGY,
    type: DEFAULT_STRATEGY_TYPE,
    strategyList: [],
    typeList: []
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },

  effects: {

    /**
     * 获取角色策略
     * @param {*} param0
     * @param {*} param1
     */
    *fetchStrategy({ payload }, { call, put, take }) {

      // 同步获取appId
      let { appId } = payload;
      if (!appId) {
        const takeAction = yield take('global/selectAppToManage');
        appId = takeAction.payload.appId;
      }

      // 服务器获取数据
      const strategyList = yield call(getStrategyList, {
        ...payload,
        appId,
        pageSize: 20
      });

      // 触发同步action操作，更新state
      yield put({
        type: 'saveStrategy',
        payload: strategyList
      });
    },

    *getStrategy({ payload }, { call, put }) {
      const strategy = yield call(getStrategy, payload);

      if (strategy.tagList.length === 0) {
        strategy.tagList.push(
          {
            tagId: '',
            dimeIds: []
          }
        );
      }

      // 触发同步action操作，更新state
      yield put({
        type: 'mergeStrategy',
        payload: strategy
      });
    },

    *createStrategy({ payload }, { call }) {
      yield call(createStrategy, payload);
    },

    *updateStrategy({ payload }, { call }) {
      yield call(updateStrategy, payload);
    },

    *removeStrategy({ payload }, { call }) {
      yield call(removeStrategy, payload);
    },

    /**
     * 获取策略类型
     */
    *fetchType({ payload }, { call, put, take }) {

      // 同步获取appId
      let { appId } = payload;
      if (!appId) {
        const takeAction = yield take('global/selectAppToManage');
        appId = takeAction.payload.appId;
      }

      // 服务器获取数据
      const typeList = yield call(getTypeList, {
        ...payload,
        appId,
        pageSize: 20
      });

      // 触发同步action操作，更新state
      yield put({
        type: 'saveStrategyType',
        payload: typeList
      });
    },

    /**
     * 获取策略类型
     */
    *fetchTypeAll({ payload }, { call, put, take }) {

      // 同步获取appId
      let { appId } = payload;
      if (!appId) {
        const takeAction = yield take('global/selectAppToManage');
        appId = takeAction.payload.appId;
      }

      // 服务器获取数据
      const typeList = yield call(getTypeListAll, {
        ...payload,
        appId
      });

      // 触发同步action操作，更新state
      yield put({
        type: 'saveStrategyType',
        payload: typeList
      });
    },

    *createType({ payload }, { call }) {
      yield call(createType, payload);
    },

    *updateType({ payload }, { call }) {
      yield call(updateType, payload);
    },

    *removeType({ payload }, { call }) {
      yield call(removeType, payload);
    }
  },

  reducers: {
    mergeStrategy(state, { payload = DEFAULT_STRATEGY }) {
      return {
        ...state,
        strategy: {
          ...state.strategy,
          ...payload
        }
      };
    },
    mergeType(state, { payload = DEFAULT_STRATEGY_TYPE }) {
      return {
        ...state,
        type: {
          ...state.type,
          ...payload
        }
      };
    },
    saveStrategy(state, action) {
      return {
        ...state,
        strategyList: action.payload
      };
    },
    saveStrategyType(state, action) {
      return {
        ...state,
        typeList: action.payload
      };
    }
  }
};
