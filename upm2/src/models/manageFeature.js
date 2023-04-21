import {
  getFeaturesList,
  getFeaturesTree,
  delFeature,
  addFeature,
  updateFeature,
  getLimits,
  removeLimits,
  addLimit,
  fetchBindRolesList,
  fetchRoleList,
  insertMutirole
} from '../services/manageFeature';
import { find, findIndex } from 'lodash';

import findTreeNodeById from '@utils/findTreeNodeById';

const addPathAndParent = (list, path = []) => {
  return list.map(item => {
    item.path = path.concat(item.id);
    if (item.children) {
      item.children.forEach(child => (child.parent = item));
      addPathAndParent(item.children, item.path);
    }
    return item;
  });
};

const defaultState = {
  list: [],
  parents: [],
  limits: [],
  bindRoles: [],
  roleList: [],
  loading: {
    fetch: false
  }
};

export default {
  namespace: 'feature',

  state: defaultState,

  subscriptions: {
    setup({ dispatch, history }) {
      // eslint-disable-line
    }
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      // eslint-disable-line
      yield put({
        type: 'saveLoading',
        payload: {
          fetch: true
        }
      });
      try {
        const list = yield call(getFeaturesTree, payload);
        // const nodes = yield call(getFeaturesList, {
        //   ...payload,
        //   isMenu: ''
        // });

        yield put({
          type: 'save',
          payload: {
            list: addPathAndParent(list)
          }
        });
      } finally {
        yield put({
          type: 'saveLoading',
          payload: {
            fetch: false
          }
        });
      }
    },
    *addFakeFeature({ payload }, { put }) {
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
    *delFeature({ payload }, { call, put, select }) {
      const { id, isFake, parent, appId } = payload;

      if (!isFake) {
        yield call(delFeature, {
          id,
          appId
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
        const list = yield select(state => state.feature.list);
        yield put({
          type: 'save',
          payload: {
            list: list.filter(item => item.id !== id)
          }
        });
      }

      // 过滤被删掉的此节点
      const parents = yield select(state => state.feature.parents);

      yield put({
        type: 'save',
        payload: {
          parents: [...parents.filter(node => node.id !== id)]
        }
      });
    },
    *updateFeature({ payload }, { call, put, select }) {
      let {
        isFake,
        id,
        name,
        pid,
        appId,
        path,
        isMenu,
        remark,
        url,
        langNameList,
        sortVal,
        icon,
        openType,
        riskLevel
      } = payload;

      try {
        if (isFake) {
          const data = yield call(addFeature, {
            name,
            isMenu,
            remark,
            url,
            pid,
            appId,
            langNameList,
            riskLevel,
            sortVal,
            icon
          });
          id = data.id;
          isFake = false;

          // 新节点添加成功后就可以作为父节点供选择
          const parents = yield select(state => state.feature.parents);

          yield put({
            type: 'save',
            payload: {
              parents: [...parents, data]
            }
          });
        } else {
          yield call(updateFeature, {
            id,
            name,
            pid,
            isMenu,
            remark,
            url,
            appId,
            langNameList,
            sortVal,
            icon,
            openType,
            riskLevel
          });
        }

        yield put({
          type: 'update',
          payload: {
            path,
            id,
            isFake,
            name,
            pid,
            isMenu,
            remark,
            url,
            langNameList,
            sortVal,
            icon,
            openType
          }
        });
        return {
          success: true
        };
      } catch (error) {
        return {
          success: false,
          result: error.message
        };
      }
    },

    *getBindingLimits({ payload }, { call, put }) {
      const { featureId, appId } = payload;
      const limits = yield call(getLimits, {
        featureId,
        appId
      });

      yield put({
        type: 'updateLimitsData',
        payload: {
          id: featureId,
          data: limits
        }
      });
    },
    *addLimit({ payload }, { call, put }) {
      const limits = yield call(addLimit, payload);

      yield put({
        type: 'updateLimitsData',
        payload: {
          id: payload.featureId,
          data: limits
        }
      });
    },
    *deleteLimits({ payload }, { call, put }) {
      const { appId, featureId, ids } = payload;
      const limits = yield call(removeLimits, payload);

      yield put({
        type: 'updateLimitsData',
        payload: {
          id: featureId,
          data: limits
        }
      });
    },
    *fetchBindRolesList({ payload }, { call, put }) {
      const { featureId, appId } = payload;
      const bindRoles = yield call(fetchBindRolesList, {
        featureId,
        appId
      });
      yield put({
        type: 'save',
        payload: {
          bindRoles
        }
      });
    },
    *fetchRoleList({ payload }, { call, put }) {
      const roleList = yield call(fetchRoleList, payload);

      yield put({
        type: 'save',
        payload: {
          roleList
        }
      });
    },
    *insertMutirole({ payload }, { call, put }) {
      yield call(insertMutirole, payload);
    }
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    saveLoading(state, { payload }) {
      return {
        ...state,
        loading: {
          ...state.loading,
          ...payload
        }
      };
    },
    updateLimitsData(state, { payload }) {
      const { id, data } = payload;
      const limitsData = state.limits;

      const boundingFeatureIndex = findIndex(limitsData, { id });

      if (boundingFeatureIndex < 0) {
        limitsData.push({
          id,
          data
        });
      } else {
        limitsData.splice(boundingFeatureIndex, 1, {
          id,
          data
        });
      }

      return {
        ...state,
        limits: [...limitsData]
      };
    },
    addRoot(state, action) {
      const { list, parents, limits } = state;

      return {
        ...state,
        list: [action.payload, ...list],
        parents,
        limits
      };
    },
    update(state, { payload }) {
      const { list, parents, limits } = state;

      const { path, pid, ...targets } = payload;

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

      // 如果修改了树节点的 pid, 那么意味着需要把 item 移动到新父节点的children里去
      if (pid !== undefined && item.pid !== pid) {
        if (item.pid == 0) {
          const itemIndex = findIndex(list, ['id', item.id]);
          list.splice(itemIndex, 1);
        } else {
          // 之前的父节点去掉 item
          const originalParent = findTreeNodeById(list, item.pid);
          originalParent.children = originalParent.children.filter(
            node => node.id !== item.id
          );
        }

        // 修改item自身属性
        item.pid = pid;
        item.path.splice(-1, 1, pid);

        if (pid == 0) {
          list.push(item);
        } else {
          item.parent = find(parents, ['id', pid]);

          // 放item到修改后的parent里
          const subsequentParent = findTreeNodeById(list, item.pid);
          if (subsequentParent.children) {
            subsequentParent.children = [...subsequentParent.children, item];
          } else {
            subsequentParent.children = [item];
          }
        }
      }

      return {
        ...state,
        list: addPathAndParent([...list]),
        parents,
        limits
      };
    }
  }
};
