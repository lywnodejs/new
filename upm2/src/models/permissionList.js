import {
  fetchRoleList, fetchDataList, fetchAreaList,
  fetchRoleDetail, removeRolePermission, removeDataPermission,
  fetchDataDetail, fetchPermissionList, fetchOtherPermissionList,
  permissionClose, permissionSaveOther, permissionBatchApply,
  fetchTransferUserTodoList
} from '../services/permissionList';

const SIZE = 10;
const PAGE_SIZE = 20;

const initialSearch = {
  current: 1,
  size: SIZE,
  total: 0,
};

export default {

  namespace: 'permissionList',

  state: {
    roleList: [],
    roleSearches: initialSearch,
    roleMap: {

    }, // roleId: roleDetail
    dataList: [],
    dataSearches: initialSearch,
    dataMap: {

    }, // dataId: dataDetail
    areaList: [],
    areaSearches: initialSearch,

    permissionData: [],
    otherPermissionData: [],
    loading: false,
    userNames: []
  },

  subscriptions: {},

  effects: {
    *fetchRoleList ({ payload }, { call, put }) {
      const {
        page, size = SIZE, appId, roleName,
      } = payload;

      const {
        total,
        records,
        current,
      } = yield call(fetchRoleList, { page, size, appId, roleName });

      yield put({
        type: 'save',
        payload: {
          roleList: records,
          roleSearches: {
            total,
            current,
          }
        }
      });
    },

    *fetchRoleDetail ({ payload }, { call, put, select }) {
      const {
        appId, roleId,
      } = payload;

      const detail = yield call(fetchRoleDetail, { appId, roleId });

      yield put({
        type: 'updateRoleMap',
        payload: {
          [roleId]: detail
        }
      });
    },

    *removeRolePermission ({ payload }, { call }) {
      const {
        appId, roleId,
      } = payload;

      yield call(removeRolePermission, { appId, id: roleId });
    },
    *removeDataPermission ({ payload }, { call }) {
      const { resourceId, appId } = payload;
      yield call(removeDataPermission, {
        id: resourceId,
        appId
      });
    },

    *fetchDataList ({ payload }, { call, put }) {
      const { page, size = SIZE, resourceTypeId, resourceName, appId } = payload;
      const {
        total,
        records,
        current,
      } = yield call(fetchDataList, { page, size, resourceTypeId, resourceName, appId });

      yield put({
        type: 'save',
        payload: {
          dataList: records,
          dataSearches: {
            total,
            current,
          }
        }
      });
    },

    *fetchDataDetail ({ payload }, { call, put, select }) {
      const {
        resourceId
      } = payload;

      const detail = yield call(fetchDataDetail, { resourceId });

      yield put({
        type: 'updateDataMap',
        payload: {
          [resourceId]: detail
        }
      });
    },

    *fetchAreaList ({ payload }, { call, put }) {
      const { page, size = SIZE, appId, businessId } = payload;
      const {
        total,
        records,
        current,
      } = yield call(fetchAreaList, { page, size, appId, businessId });

      yield put({
        type: 'save',
        payload: {
          areaList: records,
          areaSearches: {
            total,
            current
          }
        }
      });
    },

    *resetRole ({ payload }, { put }) {
      yield put({
        type: 'reset',
        payload: {
          resetType: 'role'
        }
      });
    },
    *resetData ({ payload }, { put }) {
      yield put({
        type: 'reset',
        payload: {
          resetType: 'data'
        }
      });
    },
    *resetArea ({ payload }, { put }) {
      yield put({
        type: 'reset',
        payload: {
          resetType: 'area'
        }
      });
    },
    *fetchPermissionList ({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          loading: true
        }
      });

      const data = yield call(fetchPermissionList, {
        ...payload,
        // size: PAGE_SIZE
      });

      yield put({
        type: 'save',
        payload: {
          permissionData: data,
          loading: false
        }
      });
    },
    *fetchOtherPermissionList ({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          loading: true
        }
      });
      const { reservedList, permissionType } = payload;
      delete payload.reservedList;
      const data = yield call(fetchOtherPermissionList, {
        ...payload,
        // size: PAGE_SIZE
      });

      data.records.map(item => {
        item.permissionStatus = 2;
      });

      if (reservedList[permissionType]) {
        data.records.map(item => {
          const response = reservedList[permissionType].findIndex(row => row.relId === item.relId);
          if (response >= 0) {
            item.permissionStatus = 1;
          }
        });
      }


      yield put({
        type: 'save',
        payload: {
          otherPermissionData: data,
          loading: false
        }
      });

      return data;
    },
    *permissionClose ({ payload }, { call }) {
      return yield call(permissionClose, payload);
    },
    *permissionSaveOther ({ payload }, { call }) {
      return yield call(permissionSaveOther, payload);
    },
    *permissionBatchApply ({ payload }, { call }) {
      return yield call(permissionBatchApply, payload);
    },
    *fetchTransferUserTodoList (payload, { call, put }) {
      const data = yield call(fetchTransferUserTodoList, payload);
      yield put({
        type: 'save',
        payload: {
          userNames: data
        }
      });
      return data;
    }
  },

  reducers: {
    save (state, { payload }) {
      return { ...state, ...payload };
    },

    reset (state, { payload: { resetType } }) {
      return {
        ...state,
        [`${resetType}Searches`]: initialSearch,
        [`${resetType}List`]: [],
      };
    },

    updateRoleMap (state, { payload }) {
      return {
        ...state,
        roleMap: {
          ...state.roleMap,
          ...payload
        }
      };
    },

    updateDataMap (state, { payload }) {
      return {
        ...state,
        dataMap: {
          ...state.dataMap,
          ...payload
        }
      };
    },
  }
};
