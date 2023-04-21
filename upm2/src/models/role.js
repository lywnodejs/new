/**
 * 角色Model
 * by zhangdi
 */

import {
  getRoleList,
  getRoleListAll,
  getRoleGroupList,
  getRoleGroupListAll,
  getFeatureGroupListAll,
  createRole,
  removeRole,
  updateRole,
  createRoleGroup,
  removeRoleGroup,
  updateRoleGroup,
  getRoleRelevantGroup,
  getGroupRelevantRole,
  getRoleRelevantUser,
  getRoleRelevantFlag,
  getRoleRelevantFeature,
  getRoleRelevantStrategy,
  getRoleRelevantFeatureGroup,
  relevantGroup,
  relevantFeatureGroup,
  relevantUser,
  relevantFeature,
  relevantFlag,
  unRelevantUser,
  relevantRole,
  getRoleDimeList,
  bindProduct,
  saveTags,
  removeTags,
  findTags,
  getRolelabelList,
  addRolelabel,
  editRolelabel,
  deleteRolelabel,
  getAllRolelabelList,
  cancleAllRoleUser,
  recommendRoles,
  relevantUser2Group,
  unRelevantUser2Group,
  getRoleGroupRelevantUser,
  clearRelevantUser2Group
} from '../services/role';

// 默认角色
const DEFAULT_ROLE = {
  id: '',
  name: '',
  nameZh: '',
  description: '',
  appId: 0,
  status: 1,
  creator: null,
  createdAt: null,
  updatedAt: null,
  isDelete: 0,
  featureList: [], // 关联功能集合
  flagList: [], // 关联标识符集合
  userList: [], // 关联用户
  groupList: [], // 关联角色组
  featureGroupList: [], // 关联功能组
  strategy: [], // 关联策略
  defaultCheckedGroups: [],
  defaultCheckedFeatureGroups: [], // 角色关联功能组 
  riskLevel: '',
  labels: []
};

// 默认角色组
const DEFAULT_ROLE_GROUP = {
  id: 0,
  name: '',
  appId: 0,
  nameZh: '',
  pid: 0,
  parentName: null,
  status: 1,
  createdAt: null,
  updatedAt: null,
  isDelete: 0,
  roleList: [], // 关联角色
  userList: [], // 关联用户
  defaultCheckedRoles: [],
  riskLevel: ''
};

const setTags = (roleData, tagsData) => {
  // 把list打到hash上，提高效率
  const idHash = {}
  tagsData.info.length ? tagsData.info.forEach(i => {
    idHash[i.id] = i.label
  }): null

  // 给列表增加tags的字段
  roleData.records ? roleData.records.forEach(i => {
    i.tags = idHash[i.id] || []
  }) : null

  return roleData
}

export default {
  namespace: 'role',

  state: {
    loading: {},
    role: DEFAULT_ROLE, // 角色对象
    roleGroup: DEFAULT_ROLE_GROUP, // 角色组对象
    roleList: {}, // 角色集合
    roleGroupList: {}, // 角色组集合
    featureGroupList: [], // 功能组集合
    // 角色的国家列表
    roleDimeList: [],
    rolelabelList: [],
    allRolelabelList: [],
    rolelabel: {
      name: '',
      desc: ''
    },
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
    * 获取角色全部分类
    */
    *handleCancleUser({ payload }, { call }) {
      // 服务器获取数据
      yield call(cancleAllRoleUser, payload);
    },
    /**
    * 获取角色全部分类
    */
    *fetchRolelabelListALL({ payload }, { call, put, take }) {
       // 同步获取appId
      let { appId } = payload;
      if (!appId) {
        const takeAction = yield take('global/selectAppToManage');
        appId = takeAction.payload.appId;
      }
      // 服务器获取数据
      const allRolelabelList = yield call(getAllRolelabelList, payload);
      // 触发同步action操作，更新state
      yield put({
        type: 'saveAllRolelabelList',
        payload: allRolelabelList
      });
    },
    /**
     * 获取角色列表
     * @param {*} param0
     * @param {*} param1
     */
    *fetchRole({ payload }, { call, put, take }) {

      // 同步获取appId
      let { appId } = payload;
      if (!appId) {
        const takeAction = yield take('global/selectAppToManage');
        appId = takeAction.payload.appId;
      }
      // 服务器获取数据
      const roles = yield call(getRoleList, {
        ...payload,
        appId,
        size: 20
      });

      // 标签字段是另一个接口
      const idList = roles.records.length ? roles.records.map(i => i.id) : []

      const tagsData =  yield call(findTags, {
        idList,
        appId,
        type: 2 // 查询角色
      })
      setTags(roles, tagsData)

      // 触发同步action操作，更新state
      return yield put({
        type: 'saveRole',
        payload: roles
      });
    },

    /**
     * 获取全部角色
     * @param {*} param0
     * @param {*} param1
     */
    *fetchRoleAll({ payload }, { call, put, take }) {

      // 同步获取appId
      let { appId } = payload;
      if (!appId) {
        const takeAction = yield take('global/selectAppToManage');
        appId = takeAction.payload.appId;
      }

      // 服务器获取数据
      const roles = yield call(getRoleListAll, {
        appId,
        ...payload
      });

      // 触发同步action操作，更新state
      yield put({
        type: 'saveRole',
        payload: roles
      });
    },

    /**
     * 获取角色组列表
     * @param {*} param0
     * @param {*} param1
     */
    *fetchRoleGroup({ payload }, { call, put, take }) {

      // 同步获取appId
      let { appId } = payload;
      if (!appId) {
        const takeAction = yield take('global/selectAppToManage');
        appId = takeAction.payload.appId;
      }

      // 服务器获取数据
      const roleGroups = yield call(getRoleGroupList, {
        ...payload,
        appId,
        size: 20
      });

        // 标签字段是另一个接口
      const idList = roleGroups.records.length ? roleGroups.records.map(i => i.id) : []
      const tagsData =  yield call(findTags, {
        idList,
        appId,
        type: 5 // 查询角色组
      })
      setTags(roleGroups, tagsData)

      // 触发同步action操作，更新state
      return yield put({
        type: 'saveRoleGroup',
        payload: roleGroups
      });
    },

    /**
    * 获取全部角色组
    */
    *fetchRoleGroupAll({ payload }, { call, put }) {
      // 服务器获取数据
      const roleGroups = yield call(getRoleGroupListAll, payload);

      // 触发同步action操作，更新state
      yield put({
        type: 'saveRoleGroup',
        payload: roleGroups
      });
    },

    /**
    * 获取全部功能组
    */
    *fetchFeatureGroupAll({ payload }, { call, put }) {
      // 服务器获取数据
      const featureGroups = yield call(getFeatureGroupListAll, payload);

      // 触发同步action操作，更新state
      yield put({
        type: 'saveFeatureGroup',
        payload: featureGroups
      });
    },

    /**
    * 获取角色分类
    */
    *fetchRolelabelList({ payload }, { call, put }) {
      // 服务器获取数据
      const rolelabelList = yield call(getRolelabelList, payload);

      // 触发同步action操作，更新state
      yield put({
        type: 'saveRolelabelList',
        payload: rolelabelList
      });
    },

    /**
    * 获取角色分类
    */
    *fetchAllRolelabelList({ payload }, { call, put }) {
      // 服务器获取数据
      const allRolelabelList = yield call(getAllRolelabelList, payload);

      // 触发同步action操作，更新state
      yield put({
        type: 'saveAllRolelabelList',
        payload: allRolelabelList
      });
    },
    *addRolelabel({ payload }, { call }) {
      yield call(addRolelabel, payload);
    },
    *updateRolelabel({ payload }, { call }) {
      yield call(editRolelabel, payload);
    },
    *deleteRolelabel({ payload }, { call }) {
      try {
        const result = yield call(deleteRolelabel, payload);
        return {
          success: true,
          result,
        };
      } catch (error) {
        return {
          success: false,
          result: error.message,
        };
      }
    },

    /**
     * 获取角色关联的角色组
     */
    *fetchRelevantGroup({ payload }, { call, put }) {
      // 服务器获取数据
      const groupList = yield call(getRoleRelevantGroup, payload);

      // 触发同步action操作，更新state
      yield put({
        type: 'mergeRole',
        payload: {
          groupList: groupList,
          defaultCheckedGroups: groupList
        }
      });
    },

     /**
     * 获取角色关联的功能组
     */
    *fetchRelevantFeatureGroup({ payload }, { call, put }) {
      // 服务器获取数据
      const featureGroupList = yield call(getRoleRelevantFeatureGroup, payload);
      // const featureGroupList = []
      // 触发同步action操作，更新state
      yield put({
        type: 'mergeRole',
        payload: {
          featureGroupList: featureGroupList,
          defaultCheckedFeatureGroups: featureGroupList
        }
      });
    },

    /**
     * 获取角色组关联角色
     * @param {*} param0
     * @param {*} param1
     */
    *fetchRelevantRole({ payload }, { call, put }) {
      // 服务器获取数据
      const roleList = yield call(getGroupRelevantRole, payload);

      // 触发同步action操作，更新state
      yield put({
        type: 'mergeRoleGroup',
        payload: {
          roleList: roleList,
          defaultCheckedRoles: roleList
        }
      });
    },

    /**
     * 获取角色关联的标识位
     */
    *fetchRelevantFlag({ payload }, { call, put }) {
      // 服务器获取数据
      const flagList = yield call(getRoleRelevantFlag, payload);

      // 触发同步action操作，更新state
      yield put({
        type: 'mergeRole',
        payload: {
          flagList: flagList
        }
      });
    },

    /**
     * 获取角色关联的功能
     */
    *fetchRelevantFeature({ payload }, { call, put }) {
      // 服务器获取数据
      const featureList = yield call(getRoleRelevantFeature, payload);

      // 触发同步action操作，更新state
      yield put({
        type: 'mergeRole',
        payload: {
          featureList: featureList
        }
      });
    },

    /**
     * 获取绑定用户
     */
    *fetchRelevantUser({ payload }, { call, put }) {
      // 服务器获取数据
      const userList = yield call(getRoleRelevantUser, {
        ...payload,
        size: 20
      });

      // 触发同步action操作，更新state
      yield put({
        type: 'mergeRole',
        payload: {
          userList: userList
        }
      });
    },

    /**
     * 获取绑定策略
     */
    *fetchRelevantStrategy({ payload }, { call, put }) {
      // 服务器获取数据
      const strategy = yield call(getRoleRelevantStrategy, payload);

      // 触发同步action操作，更新state
      yield put({
        type: 'mergeRole',
        payload: {
          strategy: strategy
        }
      });
    },

    /**
     * 新增角色
     * @param {*} param0
     * @param {*} param1
     */
    *createRole({ payload }, { call }) {
      // 服务器获取数据
      yield call(createRole, payload);
    },

    /**
     * 删除角色
     * @param {*} param0
     * @param {*} param1
     */
    *removeRole({ payload }, { call }) {
      // 服务器获取数据
      yield call(removeRole, payload);
    },

    /**
     * 更新角色
     */
    *updateRole({ payload }, { call }) {

      yield call(updateRole, payload);
    },
    // 复制角色
    *copyRole({ payload }, { call }) {

      yield call(createRole, payload);
    },

    /**
     * 角色关联角色组
     * @param {*} param0
     * @param {*} param1
     */
    *relevantGroup({ payload }, { call }) {
      // 服务器更新数据
      yield call(relevantGroup, payload);
    },

    /**
     * 角色关联功能组
     * @param {*} param0
     * @param {*} param1
     */
    *relevantFeatureGroup({ payload }, { call,put }) {
      yield put({
        type: 'saveLoading',
        payload: {
          loadingRelevantFeatureGroup: true
        }
      })
      // 服务器更新数据
      yield call(relevantFeatureGroup, payload);
      yield put({
        type: 'saveLoading',
        payload: {
          loadingRelevantFeatureGroup: false
        }
      })
    },

    /**
     * 角色关联用户
     * @param {*} param0
     * @param {*} param1
     */
    *relevantUser({ payload }, { call }) {
      // 服务器更新数据
      yield call(relevantUser, payload);
    },

    /**
     * 角色关联功能
     * @param {*} param0
     * @param {*} param1
     */
    *relevantFeature({ payload }, { call }) {
      // 服务器更新数据
      yield call(relevantFeature, payload);
    },

    /**
     * 角色关联标识位
     * @param {*} param0
     * @param {*} param1
     */
    *relevantFlag({ payload }, { call }) {
      // 服务器更新数据
      yield call(relevantFlag, payload);
    },

    /**
     * 角色关联角色组
     * @param {*} param0
     * @param {*} param1
     */
    *unRelevantUser({ payload }, { call }) {
      // 服务器更新数据
      yield call(unRelevantUser, payload);
    },

    /**
     * 新增角色组
     * @param {*} param0
     * @param {*} param1
     */
    *createRoleGroup({ payload }, { call }) {
      // 服务器获取数据
      yield call(createRoleGroup, payload);
    },

    /**
     * 删除角色组
     * @param {*} param0
     * @param {*} param1
     */
    *removeRoleGroup({ payload }, { call }) {
      // 服务器获取数据
      yield call(removeRoleGroup, payload);
    },

    /**
     * 更新角色组
     */
    *updateRoleGroup({ payload }, { call }) {

      yield call(updateRoleGroup, {
        pid: 0,
        ...payload
      });
    },

    /**
     * 角色组关联角色
     * @param {*} param0
     * @param {*} param1
     */
    *relevantRole({ payload }, { call }) {
      yield call(relevantRole, payload);
    },

    // 获取角色的国家列表
    *fetchRoleDimeList({ payload }, { call, put, take }) {
      let { appId } = payload;
      if (!appId) {
        const takeAction = yield take('global/selectAppToManage');
        appId = takeAction.payload.appId;
      }

      const roleDimeList = yield call(getRoleDimeList, appId);
      yield put({
        type: 'save',
        payload: {
          roleDimeList,
        },
      });
    },
    *bindProduct({ payload }, { call }) {
      yield call(bindProduct, payload);
    },
    *saveTags({ payload }, { call }) {
      return yield call(saveTags, payload)
    },
    *removeTags({ payload }, { call }) {
      return yield call(removeTags, payload)
    },
    *recommendRoles({ payload }, { call }) {
      return yield call(recommendRoles, payload)
    },
    *relevantUser2Group({ payload }, { call }) {
      return yield call(relevantUser2Group, payload)
    },
    *unRelevantUser2Group({ payload }, { call }) {
      return yield call(unRelevantUser2Group, payload)
    },
    *clearRelevantUser2Group({ payload }, { call }) {
      return yield call(clearRelevantUser2Group, payload)
    },
    *getRoleGroupRelevantUser({ payload }, { call, take }) {
      let { appId } = payload;
      if (!appId) {
        const takeAction = yield take('global/selectAvailableAppToManage');
        appId = takeAction.payload.appId;
      }

      return yield call(getRoleGroupRelevantUser, {
        appId,
        ...payload
      })
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    mergeRole(state, { payload = DEFAULT_ROLE }) {
      return {
        ...state,
        role: {
          ...state.role,
          ...payload
        }
      };
    },
    mergeRoleGroup(state, { payload = DEFAULT_ROLE_GROUP }) {
      return {
        ...state,
        roleGroup: {
          ...state.roleGroup,
          ...payload
        }
      };
    },
    saveRole(state, action) {
      return {
        ...state,
        roleList: action.payload
      };
    },
    saveRoleGroup(state, action) {
      return {
        ...state,
        roleGroupList: action.payload
      };
    },
    saveFeatureGroup(state, action) {
      return {
        ...state,
        featureGroupList: action.payload
      };
    },
    saveRolelabelList(state, action) {
      return {
        ...state,
        rolelabelList: action.payload
      };
    },
    saveAllRolelabelList(state, action) {
      return {
        ...state,
        allRolelabelList: action.payload
      };
    },
    mergeRolelabel(state, { payload = { name: '', desc: '' } }) {
      return {
        ...state,
        rolelabel: {
          ...state.rolelabel,
          ...payload
        }
      };
    },
    saveLoading( state, { payload } ) {
      return {
        ...state,
        loading: {
          ...state.loading,
          ...payload
        }
      }
    }
  }
};
