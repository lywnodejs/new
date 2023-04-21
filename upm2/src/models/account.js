/**
 * 用户Model
 * by zhangdi
 */

import {
  getAccountList,
  getMatchAccount,
  registerAccount,
  removeAccount,
  copyAccount,
  getRelevantGroup,
  getRelevantRole,
  getRelevantFlag,
  getRelevantRegion,
  relevantGroup,
  relevantRole,
  relevantFlag,
  relevantRegion,
  expireRole,
  expireRoleGroup,
  getManageAppList,
  batchUpdateSys
} from '../services/account';

// 默认用户
const DEFAULT_ACCOUNT = {
  id: 0,
  username: '',
  usernameZh: '',
  email: '',
  phone: '',
  dept: '',
  job: '',
  status: 0,
  flagList: [],
  roleList: [],
  groupList: [],
  regionList: [],
  appList: [] // 子系统
};

function updateArray(array, action) {
  return array.map((item, index) => {
    if (index !== action.index) {
      // 这不是我们关心的项-保持原来的值
      return item;
    }

    // 否则, 这是我们关心的-返回一个更新的值
    return {
      ...item,
      ...action.item
    };
  });
}

export default {
  namespace: 'account',

  state: {
    account: DEFAULT_ACCOUNT, // 账户对象
    accountList: {}, // 账号集合
    matchList: [], // 匹配的用户
    params: {
      username: '', // 账户
      usernameZh: '', // 名称
      email: '' // 邮箱
    }
  },

  subscriptions: {
    /**
     * 事件注册
     * 进入角色管理页面，查询数据
     * @param {*} param0
     */
    setup({ dispatch, history }) {
      // eslint-disable-line
    }
  },

  effects: {
    /**
     * 获取账号列表
     * @param {*} param0
     * @param {*} param1
     */
    *fetchAccount({ payload }, { call, put, take }) {
      // 同步获取appId
      let { appId } = payload;
      if (!appId) {
        const takeAction = yield take('global/selectAppToManage');
        appId = takeAction.payload.appId;
      }

      // 服务器获取数据
      const roles = yield call(getAccountList, {
        ...payload,
        appId,
        size: 20
      });

      // 触发同步action操作，更新state
      yield put({
        type: 'saveAccount',
        payload: roles
      });
    },

    *fetchMatchAccount({ payload }, { call, put, take }) {
      // 同步获取appId
      let { appId } = payload;
      if (!appId) {
        const takeAction = yield take('global/selectAppToManage');
        appId = takeAction.payload.appId;
      }

      // 服务器获取数据
      const roles = yield call(getMatchAccount, {
        ...payload,
        appId
      });

      // 触发同步action操作，更新state
      yield put({
        type: 'saveMatchAccount',
        payload: roles
      });
    },

    /**
     * 获取账号关联的角色组
     */
    *fetchRelevantFlag({ payload }, { call, put }) {
      // 服务器获取数据
      const flagList = yield call(getRelevantFlag, payload);

      // 触发同步action操作，更新state
      yield put({
        type: 'mergeAccount',
        payload: {
          flagList: flagList
        }
      });
    },

    /**
     * 获取账号关联的角色组
     */
    *fetchRelevantGroup({ payload }, { call, put }) {
      // 服务器获取数据
      const groupList = yield call(getRelevantGroup, payload);

      // 触发同步action操作，更新state
      yield put({
        type: 'mergeAccount',
        payload: {
          groupList: groupList
        }
      });
    },

    /**
     * 获取账号关联角色
     * @param {*} param0
     * @param {*} param1
     */
    *fetchRelevantRole({ payload }, { call, put }) {
      // 服务器获取数据
      const roleList = yield call(getRelevantRole, payload);

      // 触发同步action操作，更新state
      yield put({
        type: 'mergeAccount',
        payload: {
          roleList: roleList
        }
      });
    },

    /**
     * 获取账号关联地区
     * @param {*} param0
     * @param {*} param1
     */
    *fetchRelevantRegion({ payload }, { call, put }) {
      // 服务器获取数据
      const regionList = yield call(getRelevantRegion, payload);

      // 触发同步action操作，更新state
      yield put({
        type: 'mergeAccount',
        payload: {
          regionList: regionList
        }
      });
    },

    /**
     * 新增角色
     * @param {*} param0
     * @param {*} param1
     */
    *registerAccount({ payload }, { call }) {
      // 服务器获取数据
      yield call(registerAccount, payload);
    },

    /**
     * 删除角色
     * @param {*} param0
     * @param {*} param1
     */
    *removeAccount({ payload }, { call }) {
      // 服务器获取数据
      yield call(removeAccount, payload);
    },

    /**
     * 用户关联角色组
     * @param {*} param0
     * @param {*} param1
     */
    *relevantGroup({ payload }, { call }) {
      // 服务器更新数据
      yield call(relevantGroup, payload);
    },

    /**
     * 用户关联角色
     * @param {*} param0
     * @param {*} param1
     */
    *relevantFlag({ payload }, { call }) {
      // 服务器更新数据
      yield call(relevantFlag, payload);
    },

    /**
     * 用户关联角色
     * @param {*} param0
     * @param {*} param1
     */
    *relevantRole({ payload }, { call }) {
      yield call(relevantRole, payload);
    },

    /**
     * 用户关联地区
     * @param {*} param0
     * @param {*} param1
     */
    *relevantRegion({ payload }, { call }) {
      yield call(relevantRegion, payload);
    },

    /**
     * 设置角色过期时间
     * @param {*} param0
     * @param {*} param1
     */
    *expireRole({ payload }, { call }) {
      yield call(expireRole, payload);
    },

    /**
     * 设置角色组过期时间
     * @param {*} param0
     * @param {*} param1
     */
    *expireRoleGroup({ payload }, { call }) {
      yield call(expireRoleGroup, payload);
    },

    /**
     * 复制用户
     */
    *copyAccount({ payload }, { call }) {
      yield call(copyAccount, payload);
    },

    *getManageAppList({ payload }, { call, put }) {
      const appList = yield call(getManageAppList);

      yield put({
        type: 'mergeAccount',
        payload: {
          appList: appList || []
        }
      });
    },

    *updateManageAppList({ payload }, { select, put }) {
      const appList = yield select(state => state.account.account.appList);
      const _index = _.findIndex(appList, ['id', payload.id]);

      yield put({
        type: 'mergeAccount',
        payload: {
          appList: appList.map((item, index) => {
            if (index == _index) {
              return {
                ...item,
                ...payload
              };
            }

            return item;
          })
        }
      });
    },

    *batchUpdateSys({ payload }, { call }) {
      return yield call(batchUpdateSys, payload);
    }
  },

  reducers: {
    mergeAccount(state, { payload = DEFAULT_ACCOUNT }) {
      return {
        ...state,
        account: {
          ...state.account,
          ...payload
        }
      };
    },
    saveAccount(state, action) {
      return {
        ...state,
        accountList: action.payload
      };
    },
    saveMatchAccount(state, action) {
      return {
        ...state,
        matchList: action.payload
      };
    },
    updateRoleList(state, { payload }) {
      return {
        ...state,
        account: {
          ...state.account,
          roleList: updateArray(state.account.roleList, payload)
        }
      };
    },
    updateGroupList(state, { payload }) {
      return {
        ...state,
        account: {
          ...state.account,
          groupList: updateArray(state.account.groupList, payload)
        }
      };
    },
    updateParams(state, { payload }) {
      return {
        ...state,
        params: {
          ...state.params,
          ...payload
        }
      };
    }
  }
};
