/*
 * @Author: GuoTeng
 * @Date: 2020-07-07 16:33:30
 * @LastEditors: GuoTeng
 * @LastEditTime: 2020-10-21 16:14:19
 */
import {
  getUserAreas,
  applyAreaPermission
} from '../services/applyAreaPermission';

import {
  getAppArea,
  getAreaList, addArea, updateArea, delArea,
  addBusiness, delBusiness, updateBusiness
} from '../services/area';

import _ from 'lodash';

const formatAreasForInputTag = (root) => {
  const idMap = {};
  if (!root) {
    return { root, idMap };
  }

  const patchParent = (node, parent) => {
    const { id, idStr, name } = node;
    node.parent = parent;
    node.value = id;
    node.label = name;
    node.key = idStr;

    idMap[id] = node;

    _.each(node.children, child => patchParent(child, node));
  };
  _.each(root, node => patchParent(node, null));

  return { root, idMap };
};

const initialStore = {
  areas: [], // 已有权限的地区
  allAreas: [], // 此业务线所有地区
  areaIdMap: {}
};

export default {

  namespace: 'applyArea',

  state: initialStore,

  subscriptions: {
    set({ dispatch, history }) {
    }
  },

  effects: {
    *getAreas({ payload: { appId, businessId,applyUserName } }, { call, put }) {
      yield put({
        type: 'getUserAreas',
        payload: { appId, businessId,applyUserName }
      });

      const list = yield call(getAreaList, {
        businessId,
        appId
      });

      const { root, idMap } = formatAreasForInputTag(list);

      yield put({
        type: 'save',
        payload: {
          allAreas: root,
          areaIdMap: idMap
        }
      });
    },
    *getUserAreas({ payload: { appId, businessId,applyUserName } }, { call, put }) {
      const list = yield call(getUserAreas, {appId, businessId,applyUserName});

      yield put({
        type: 'save',
        payload: {
          areas: list
        }
      });
    },
    *applyNewArea({ payload }, { call, put, select }) {
      yield call(applyAreaPermission, payload);
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    reset() {
      return initialStore;
    }
  },
};
