import {
  getAppArea,
  getAreaList,
  addArea,
  updateArea,
  delArea,
  addBusiness,
  delBusiness,
  updateBusiness,
  getBusinessList,
  removeBusiness,
  getAppManager,
  gerAreaBindedUsers,
  bindUsersToArea,
  unBindUsersToArea
} from '../services/area';
import { getAllBusiness } from '../services/global';
import _ from 'lodash';
import { startsWith, findIndex, find } from 'lodash';

const getIdPathMap = (list, path = []) => {
  return list.map(item => {
    item.path = path.concat(item.id);
    if (item.children) {
      item.children.forEach(child => (child.parent = item));
      getIdPathMap(item.children, item.path);
    }
    return item;
  });
};

export default {
  namespace: 'area',

  state: {
    list: [],
    business: [],
    appAreas: {}, // appId: list
    areaBindedUsers: [],
    loading: {
      loadingAreaBindedUsers: false,
      loadingBindUsersToArea: false,
      loadingUnBindUsersToArea: false
    }
  },

  subscriptions: {
    set({ dispatch, history }) {}
  },

  effects: {
    *getBusiness(action, { call, put }) {
      const business = yield call(getAllBusiness);

      yield put({
        type: 'save',
        payload: {
          business
        }
      });
    },
    *getBusinessList({ payload }, { call, put }) {
      //获取
      return yield call(getBusinessList, payload);
    },
    *editBusinessList({ payload }, { call, put }) {
      //删除/添加业务线
      return yield call(removeBusiness, payload);
    },
    *changeBusinessName(
      {
        payload: { businessId, name, appId }
      },
      { call, put, select }
    ) {
      const businessList = yield select(state => state.area.business);

      const index = findIndex(businessList, ['id', businessId]);
      if (startsWith(businessId, 'business-')) {
        // 新增业务线
        const data = yield call(addBusiness, {
          name,
          appId
        });

        businessList.splice(index, 1, {
          ...data,
          originalId: businessId
        });
      } else {
        yield call(updateBusiness, {
          id: businessId,
          appId,
          name
        });

        businessList[index].name = name;
      }

      yield put({
        type: 'save',
        payload: {
          business: [...businessList]
        }
      });
    },

    *deleteBusiness(
      {
        payload: { businessId, appId }
      },
      { call, put, select }
    ) {
      const businessList = yield select(state => state.area.business);

      if (!startsWith(businessId, 'business-')) {
        yield call(delBusiness, {
          appId,
          id: businessId
        });
      }

      yield put({
        type: 'save',
        payload: {
          business: [...businessList.filter(item => item.id !== businessId)]
        }
      });
    },

    *fetch({ payload }, { call, put, select }) {
      // eslint-disable-line
      const appId = yield select(state => state.global.managingApp);
      const list = yield call(getAreaList, {
        businessId: payload,
        appId
      });

      yield put({
        type: 'save',
        payload: {
          list: getIdPathMap(list)
        }
      });
    },

    *addFakeArea({ payload }, { put }) {
      const { isFake, path, children } = payload;

      if (isFake) {
        yield put({
          type: 'addRoot',
          payload
        });
      } else {
        yield put({
          type: 'update',
          payload: {
            path,
            children
          }
        });
      }
    },

    *updateArea({ payload }, { call, put }) {
      let {
        isFake,
        id,
        name,
        aliases,
        pid,
        appId,
        path,
        aid,
        taxiId,
        businessId,
        level,
        riskLevel
      } = payload;

      if (isFake) {
        const data = yield call(addArea, {
          name,
          aliases,
          pid,
          appId,
          businessId,
          aid,
          taxiId,
          level,
          riskLevel
        });
        id = data.id;
        isFake = false;
      } else {
        yield call(updateArea, {
          id,
          name,
          aliases,
          pid,
          appId,
          businessId,
          aid,
          taxiId,
          level,
          riskLevel
        });
      }

      yield put({
        type: 'update',
        payload: {
          path,
          id,
          name,
          aliases,
          isFake,
          level,
          aid,
          taxiId,
          riskLevel
        }
      });
    },

    *delArea({ payload }, { call, put, select }) {
      const { id, isFake, parent, appId, businessId } = payload;

      if (!isFake) {
        yield call(delArea, {
          id,
          pid: parent ? parent.id : 0,
          appId,
          businessId
        });
      }

      if (parent) {
        const { path, children } = parent;

        yield put({
          type: 'update',
          payload: {
            path,
            children: children.filter(item => item.id !== id)
          }
        });
      } else {
        const list = yield select(state => state.area.list);
        yield put({
          type: 'save',
          payload: {
            list: list.filter(item => item.id !== id)
          }
        });
      }
    },

    *getAppArea({ payload: appId }, { call, put }) {
      const data = yield call(getAppArea, {
        appId
      });
      // const loopTree = (nodes, parentPos = '0') => {
      //   nodes.forEach((node, index) => {
      //     node.pos = parentPos + '-' + index;
      //     if (node.children && node.children.length > 0) {
      //       loopTree(node.children, node.pos);
      //     }
      //   });
      // };
      // loopTree(data);
      yield put({
        type: 'updateAreas',
        payload: {
          [appId]: data
        }
      });
    },

    *getAppManager({ payload = {} }, { call, put, select }) {
      let { appId, userId } = payload;

      // 如果action里没有传，则从store里取
      // if (_.isUndefined(appId)) {
      appId = 888;
      // }
      if (_.isUndefined(userId)) {
        userId = yield select(state => state.userInfo.id);
      }
      if (!_.isUndefined(appId) && !_.isUndefined(userId)) {
        const data = yield call(getAppManager, {
          appId,
          userId
        });
        let isShow = false;
        if (
          data &&
          data.findIndex(
            item => item.nameZh == '全局超级管理员' && item.isBind == 1
          ) > -1
        ) {
          isShow = true;
        }
        return isShow;
      }
    },

    *gerAreaBindedUsers({ payload, callback }, { call, put }) {
      yield put({
        type: 'saveLoading',
        payload: {
          loadingAreaBindedUsers: true
        }
      });
      try {
        const data = yield call(gerAreaBindedUsers, payload);
        if (callback && typeof callback == 'function') {
          callback(data.total);
        }
        yield put({
          type: 'save',
          payload: { areaBindedUsers: data.records }
        });
      } finally {
        yield put({
          type: 'saveLoading',
          payload: {
            loadingAreaBindedUsers: false
          }
        });
      }
    },

    *bindUsersToArea({ payload }, { call, put }) {
      yield put({
        type: 'saveLoading',
        payload: {
          loadingBindUsersToArea: true
        }
      });
      try {
        yield call(bindUsersToArea, payload);
      } finally {
        yield put({
          type: 'saveLoading',
          payload: {
            loadingBindUsersToArea: false
          }
        });
      }
    },

    *unBindUsersToArea({ payload }, { call, put }) {
      yield put({
        type: 'saveLoading',
        payload: {
          loadingUnBindUsersToArea: true
        }
      });
      try {
        yield call(unBindUsersToArea, payload);
      } finally {
        yield put({
          type: 'saveLoading',
          payload: {
            loadingUnBindUsersToArea: false
          }
        });
      }
    }
  },

  reducers: {
    updateAreas(state, action) {
      const { appAreas } = state;

      return {
        ...state,
        appAreas: {
          ...appAreas,
          ...action.payload
        }
      };
    },
    save(state, action) {
      return { ...state, ...action.payload };
    },
    saveLoading(state, action) {
      return {
        ...state,
        loading: {
          ...state.loading,
          ...action.payload
        }
      };
    },
    newBusiness(state, { payload }) {
      return {
        list: [],
        business: [payload, ...state.business]
      };
    },
    addRoot(state, action) {
      const { list } = state;

      return {
        ...state,
        list: [action.payload, ...list]
      };
    },
    update(state, { payload }) {
      const { list } = state;

      const { path, ...targets } = payload;

      let item = {};
      path.forEach((id, index) => {
        if (index === 0) {
          item = find(list, ['id', id]);
        } else {
          item = find(item.children, ['id', id]);
        }
      });

      Object.keys(targets).forEach(key => {
        item[key] = targets[key];
      });

      return {
        ...state,
        list: getIdPathMap([...list])
      };
    }
  }
};
