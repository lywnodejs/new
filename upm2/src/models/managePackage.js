import {
  fetchCategoryList,
  addCategory,
  updateCategory,
  deleteCategory,
  fetchAllCategory,
  fetchPackageList,
  getPackage,
  addPackage,
  updatePackage,
  deletePackage,
  getUserCategories,
  fetchAdminList,
  addAdmin,
  updateAdmin,
  deleteAdmin,
  fetchPackageStrategyList,
  fetchPackageUserList,
  savePackageUserList,
  unRelevantUser
} from '../services/managePackage';
import {
  fetchRoleListNew,
  fetchFlagList,
  fetchDimensionOptions,
  fetchResourceType,
  fetchResourceList,
  fetchProjectList
} from '../services/newApply';
import { getAppBindedBusiness } from '../services/admin';
import _ from 'lodash';

const DEFAULT_PACKAGE = {
  country: 'China',
  categoryId: '',
  name: '',
  desc: '',
  packageCategoryId: '',
  apps: [],
  appsData: {},
  appsTypes: {}, // 选择的权限类型
  resourceList: {}, // 可供选择的权限列表
  appbindedbusiness: {}, // app绑定的业务线列表
  businessId: {}, // 用户选择的业务线
  treeData: {}, // 可供选择的地区数据
  strategyList: [], // 可选的策略列表
  groupRoleMap: {}, // 角色组到角色的 所属关系map
  // 维度的 树形结构数据
  dimensionOptions: {},
  // 维度的 树形结构 转化后的 id => option 格式的map
  dimensionIdMap: {},
  strategy: {},
  // 生产线资源类型列表
  // resourceTypeList: [],
  resourceTypeObj: {},
  // 选择资源类型-弹窗表格数据列表
  // resourceTableList: []
  // 资源弹窗-项目列表
  projectList: {},
  // 资源类型Card loading
  resourceLoading: {}
};

const initialParams = params => {
  const { apps, country, categoryId, name, desc, roleVOS, flagVOS, areaVOS, resourceVOS } = params;
  const result = {
    country,
    categoryId,
    name,
    desc,
    apps: apps.map(item => {
      return {
        key: item.id,
        label: item.name
      };
    }),
    appsData: apps.reduce((total, item) => {
      const temp = {
        role: [],
        flag: [],
        area: []
      };
      if (roleVOS[item.id] instanceof Array && roleVOS[item.id].length) {
        temp.role = roleVOS[item.id].map((i, index) => {
          return {
            value: i.id,
            label: i.name,
            key: index,
            dimeNodeList: i.dimeNodeList,
            riskLevel: i.riskLevel
          };
        });
      }
      if (flagVOS[item.id] instanceof Array && flagVOS[item.id].length) {
        temp.flag = flagVOS[item.id].map((i, index) => {
          return {
            value: i.id,
            label: i.name,
            key: index,
            riskLevel: i.riskLevel
          };
        });
      }
      if (areaVOS[item.id] instanceof Array && areaVOS[item.id].length) {
        temp.area = areaVOS[item.id][0].packageAreaList.map(i => {
          return i.id + '';
        });
      }
      // 编辑页填充资源权限类型
      if (resourceVOS[item.id] instanceof Array && resourceVOS[item.id].length) {
        resourceVOS[item.id].map(resourceObj => {
          temp[resourceObj.identifying] = [];
        });
        resourceVOS[item.id].map(resourceObj => {
          temp[resourceObj.identifying].push({
            value: resourceObj.id,
            label: resourceObj.name,
            key: resourceObj.id,
            level: resourceObj.riskLevel
          });
        });
      }
      total[item.id] = temp;
      return total;
    }, {}),
    appsTypes: apps.reduce((total, item) => {
      const temp = [];
      if (roleVOS[item.id] instanceof Array && roleVOS[item.id].length) {
        temp.push('role');
      }
      if (flagVOS[item.id] instanceof Array && flagVOS[item.id].length) {
        temp.push('flag');
      }
      if (areaVOS[item.id] instanceof Array && areaVOS[item.id].length) {
        temp.push('area');
      }
      // 编辑页填充权限类型CheckBox
      if (resourceVOS[item.id] instanceof Array && resourceVOS[item.id].length) {
        resourceVOS[item.id].map(resourceObj => {
          if (temp.findIndex(str => str === resourceObj.identifying) == -1) {
            temp.push(resourceObj.identifying);
          }
        });
      }
      total[item.id] = temp;
      return total;
    }, {}),
    businessId: apps.reduce((total, item) => {
      if (areaVOS[item.id] instanceof Array && areaVOS[item.id].length) {
        total[item.id] = areaVOS[item.id][0].businessId;
      }
      return total;
    }, {})
  };

  return result;
};

export default {
  namespace: 'managePackage',

  state: {
    categoryList: {},
    category: {
      name: '',
      description: ''
    },
    package: DEFAULT_PACKAGE,
    allCategory: [],
    packageList: {},
    admin: {
      adminName: '',
      packageCategoryId: ''
    },
    adminList: {}
  },

  effects: {
    // 查
    *fetchCategoryList({ payload }, { call, put }) {
      // 服务器获取数据
      const categoryList = yield call(fetchCategoryList, {
        ...payload,
        size: 10
      });

      // 触发同步action操作，更新state
      return yield put({
        type: 'saveCategoryList',
        payload: categoryList
      });
    },

    *getFetchPackageUserList({ payload }, { call }) {
      const role = yield call(fetchPackageUserList, {
        ...payload
      });
      return role;
    },
    *savePackageUserList({ payload }, { call }) {
      yield call(savePackageUserList, {
        ...payload
      });
    },
    *unRelevantUser({ payload }, { call }) {
      yield call(unRelevantUser, {
        ...payload
      });
    },

    // 增
    *addCategory({ payload }, { call }) {
      yield call(addCategory, {
        ...payload
      });
    },

    // 改
    *updateCategory({ payload }, { call }) {
      yield call(updateCategory, {
        ...payload
      });
    },

    // 删
    *deleteCategory({ payload }, { call }) {
      try {
        const result = yield call(deleteCategory, payload);
        return {
          success: true,
          result
        };
      } catch (error) {
        return {
          success: false,
          result: error.message
        };
      }
    },

    // 获取所有分类
    *fetchAllCategory({ payload }, { call, put }) {
      // 服务器获取数据
      const allCategory = yield call(fetchAllCategory, payload);

      // 触发同步action操作，更新state
      return yield put({
        type: 'saveAllCategory',
        payload: allCategory
      });
    },

    // 获取权限礼包列表
    *fetchPackageList({ payload }, { call, put }) {
      // 服务器获取数据
      const packageList = yield call(fetchPackageList, {
        ...payload,
        size: 10
      });

      // 触发同步action操作，更新state
      return yield put({
        type: 'savePackageList',
        payload: packageList
      });
    },

    // 获取单个礼包详情
    *getPackage({ payload, callback }, { call, put }) {
      // 服务器获取数据
      const packageData = yield call(getPackage, {
        ...payload
      });
      const initialData = initialParams(packageData);
      // 将packageData格式化的编辑表单中
      yield put({
        type: 'mergePackage',
        payload: initialData
      });
      callback(initialData);
    },

    // 增
    *addPackage({ payload }, { call }) {
      try {
        const result = yield call(addPackage, payload);
        return {
          success: true,
          result
        };
      } catch (error) {
        return {
          success: false,
          result: error.message
        };
      }
    },

    // 改
    *updatePackage({ payload }, { call }) {
      try {
        const result = yield call(updatePackage, payload);
        return {
          success: true,
          result
        };
      } catch (error) {
        return {
          success: false,
          result: error.message
        };
      }
    },

    // 删
    *deletePackage({ payload }, { call }) {
      try {
        const result = yield call(deletePackage, payload);
        return {
          success: true,
          result
        };
      } catch (error) {
        return {
          success: false,
          result: error.message
        };
      }
    },

    // 获取角色和地区列表
    *fetchRoleListNew({ payload }, { call, put }) {
      const { params } = payload;
      const {
        page = 1,
        size = 10,
        resourceTypeId = '',
        resourceName = '',
        resourceKey = '',
        businessId = '',
        appId,
        labelId = '',
        type = '',
        id = '',
        nameZh = ''
      } = params;
      const resourceList = yield call(fetchRoleListNew, {
        appId,
        page,
        size,
        resourceName,
        resourceKey,
        resourceTypeId,
        businessId,
        labelId,
        type,
        id,
        nameZh
      });
      yield put({
        type: 'mergeResourceList',
        payload: { [appId]: resourceList }
      });
    },

    // 获取标识位列表
    *fetchFlagList({ payload }, { call, put }) {
      const { params } = payload;
      const {
        page = 1,
        size = 10,
        resourceTypeId = '',
        resourceName = '',
        resourceKey = '',
        businessId = '',
        appId,
        permissionId = '',
        permissionName = ''
      } = params;
      const resourceList = yield call(fetchFlagList, {
        appId,
        page,
        size,
        resourceName,
        resourceKey,
        resourceTypeId,
        businessId,
        permissionId,
        permissionName
      });
      yield put({
        type: 'mergeResourceList',
        payload: {
          [appId]: resourceList || []
        }
      });
    },

    // 获取appId绑定的业务线列表
    *getAppBindedBusiness({ payload }, { call, put }) {
      const appbindedbusiness = yield call(getAppBindedBusiness, payload.appId);

      yield put({
        type: 'mergeAppbindedbusiness',
        payload: {
          [payload.appId]: appbindedbusiness || []
        }
      });
    },

    // 查管理员
    *fetchAdminList({ payload }, { call, put }) {
      // 服务器获取数据
      const adminList = yield call(fetchAdminList, {
        ...payload,
        size: 10
      });

      // 触发同步action操作，更新state
      return yield put({
        type: 'saveAdminList',
        payload: adminList
      });
    },

    // 增
    *addAdmin({ payload }, { call }) {
      yield call(addAdmin, {
        ...payload
      });
    },

    // 改
    *updateAdmin({ payload }, { call }) {
      yield call(updateAdmin, {
        ...payload
      });
    },

    // 删
    *deleteAdmin({ payload }, { call }) {
      try {
        const result = yield call(deleteAdmin, payload);
        return {
          success: true,
          result
        };
      } catch (error) {
        return {
          success: false,
          result: error.message
        };
      }
    },

    // 查询用户可以管理的分类
    *getUserCategories({ payload }, { call, put }) {
      // 服务器获取数据
      const allCategory = yield call(getUserCategories, payload);

      // 触发同步action操作，更新state
      return yield put({
        type: 'saveAllCategory',
        payload: allCategory
      });
    },

    // 根据角色ID获取策略列表
    *fetchPackageStrategyList({ payload }, { call, put, select }) {
      const { appId } = payload;
      const { groupRoleMap, appsData } = yield select(state => state.managePackage.package);

      const strategyList = yield call(fetchPackageStrategyList, payload);
      const { roleStrategyOutDto, groupRoles } = strategyList;

      const newGroupRoleMap = { ...groupRoleMap };
      // 填充 角色与角色组的映射关系
      _.each(groupRoles, ({ groupId, roleId }) => {
        newGroupRoleMap[groupId] = newGroupRoleMap[groupId] || {};
        newGroupRoleMap[groupId][roleId] = groupId;
      });

      // 填充策略和维度表单
      const strategy = {};
      const roles = appsData[appId].role.map(item => {
        return {
          roleId: item.value,
          dimeNodeList: item.dimeNodeList || []
        };
      });
      _.each(roleStrategyOutDto, ({ roleId, tagDimeList, strategyDto }) => {
        const role = {};
        strategy[roleId] = role;

        _.each(tagDimeList, ({ tag, dimeDtoList }) => {
          const tags = {};
          role[tag.id] = tags;
          let dimeId = '';
          _.each(dimeDtoList, ({ id, dimeKey, dimeName }) => {
            dimeId = id;
          });
          const dimes = {};
          tags[dimeId] = dimes;
          roles
            .find(item => item.roleId === roleId)
            .dimeNodeList.map(i => {
              if (tag.id === i.tagId) {
                dimes[i.dimenodeId] = true;
              }
            });
        });
      });
      // 循环调用时候取最新appsData
      const data = yield select(state => state.managePackage.package);
      yield put({
        type: 'mergePackage',
        payload: {
          appsData: {
            ...data.appsData,
            [appId]: {
              ...data.appsData[appId],
              strategyList: roleStrategyOutDto,
              groupRoleMap: newGroupRoleMap,
              strategy: {
                ...strategy,
                ...data.appsData[appId].strategy
              }
            }
          }
        }
      });

      const dimensionIdList = [];
      _.each(roleStrategyOutDto, ({ tagDimeList }) => {
        _.each(tagDimeList, ({ dimeDtoList }) => {
          dimensionIdList.push(..._.map(dimeDtoList, ({ id }) => id));
        });
      });

      yield put({
        type: 'fetchDimension',
        payload: {
          appId,
          // id 去重一下
          dimensionIdList: _.uniq(dimensionIdList)
        }
      });
    },

    *fetchDimension({ payload }, { call, put, select }) {
      const { appId, dimensionIdList } = payload;
      const { dimensionOptions, appsData } = yield select(state => state.managePackage.package);
      for (let id of dimensionIdList) {
        // 已经加载了，则不重复加载
        if (dimensionOptions[id]) {
          continue;
        }
        const { dimension, idMap } = yield call(fetchDimensionOptions, appId, id);
        yield put({
          type: 'saveDimension',
          payload: { [id]: dimension }
        });
        yield put({
          type: 'saveDimensionIdMap',
          payload: { [id]: idMap }
        });
      }
    },

    // 获取对应系统的权限类型列表
    *fetchResourceType({ payload }, { call, put, select }) {
      const { appId } = payload;
      yield put({
        type: 'saveLoading',
        payload: {
          [appId]: true
        }
      });
      const resourceTypeList = yield call(fetchResourceType, { appId });

      yield put({
        type: 'saveResourceTypeObj',
        payload: {
          [appId]: resourceTypeList
        }
      });
      yield put({
        type: 'saveLoading',
        payload: {
          [appId]: false
        }
      });
    },

    // 获取数据资源类弹窗的资源列表
    *fetchResourceList({ payload }, { call, put }) {
      const { params } = payload;
      const {
        page = 1,
        size = 10,
        resourceTypeId = '',
        resourceName = '',
        resourceKey = '',
        businessId = '',
        appId,
        dataApp = '',
        site = '',
        projectName = '',
        resourceIds = []
      } = params;
      const resourceList = yield call(fetchResourceList, {
        appId,
        page,
        size,
        resourceName,
        resourceKey,
        resourceTypeId,
        businessId,
        dataApp,
        site,
        projectName,
        resourceIds
      });

      yield put({
        type: 'mergeResourceList',
        payload: {
          [appId]: resourceList || []
        }
      });
    },
    *fetchProjectList(
      {
        payload: { appId, attrName, attrValue }
      },
      { call, put }
    ) {
      const projectList = yield call(fetchProjectList, {
        appId,
        attrName,
        attrValue
      });

      yield put({
        type: 'saveProjectList',
        payload: {
          [appId]: projectList || []
        }
      });
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload
      };
    },

    saveCategoryList(state, action) {
      return {
        ...state,
        categoryList: action.payload
      };
    },

    mergeCategory(state, { payload = { name: '', description: '' } }) {
      return {
        ...state,
        category: {
          ...state.category,
          ...payload
        }
      };
    },

    saveAllCategory(state, action) {
      return {
        ...state,
        allCategory: action.payload
      };
    },

    savePackageList(state, action) {
      return {
        ...state,
        packageList: action.payload
      };
    },

    mergePackage(state, { payload = DEFAULT_PACKAGE }) {
      return {
        ...state,
        package: {
          ...state.package,
          ...payload
        }
      };
    },

    mergeResourceList(state, { payload }) {
      return {
        ...state,
        package: {
          ...state.package,
          resourceList: {
            ...state.package.resourceList,
            ...payload
          }
        }
      };
    },

    mergeAppbindedbusiness(state, { payload }) {
      return {
        ...state,
        package: {
          ...state.package,
          appbindedbusiness: {
            ...state.package.appbindedbusiness,
            ...payload
          }
        }
      };
    },

    mergeBusinessId(state, { payload }) {
      return {
        ...state,
        package: {
          ...state.package,
          businessId: {
            ...state.package.businessId,
            ...payload
          }
        }
      };
    },

    mergeTreeData(state, { payload }) {
      return {
        ...state,
        package: {
          ...state.package,
          treeData: {
            ...state.package.treeData,
            ...payload
          }
        }
      };
    },

    saveAdminList(state, action) {
      return {
        ...state,
        adminList: action.payload
      };
    },

    mergeAdmin(state, { payload }) {
      return {
        ...state,
        admin: {
          ...state.admin,
          ...payload
        }
      };
    },

    saveDimension(state, { payload }) {
      return {
        ...state,
        dimensionOptions: {
          ...state.dimensionOptions,
          ...payload
        }
      };
    },
    saveDimensionIdMap(state, { payload }) {
      return {
        ...state,
        dimensionIdMap: {
          ...state.dimensionIdMap,
          ...payload
        }
      };
    },
    saveResourceTypeObj(state, { payload }) {
      return {
        ...state,
        package: {
          ...state.package,
          resourceTypeObj: {
            ...state.package.resourceTypeObj,
            ...payload
          }
        }
      };
    },
    saveProjectList(state, { payload }) {
      return {
        ...state,
        package: {
          ...state.package,
          projectList: {
            ...state.package.projectList,
            ...payload
          }
        }
      };
    },
    saveLoading(state, { payload }) {
      return {
        ...state,
        package: {
          ...state.package,
          resourceLoading: {
            ...state.package.resourceLoading,
            ...payload
          }
        }
      };
    }
  }
};
