import { find, findIndex, startsWith } from 'lodash';
import {
  getDimensionList, addDimension, updateDimension, delDimension,
  addDimensionNode, updateDimensionNode, delDimensionNode, getDimensionDetail
} from '../services/dimension';

const getIdPathMap = (list, path=[]) => {
  return list.map((item) => {
    item.name = item.dimeNodeName; // 树只接受 name 来显示节点名
    item.path = path.concat(item.id);
    if (item.children) {
      item.children.forEach((child) => child.parent = item);
      getIdPathMap(item.children, item.path);
    }
    return item;
  });
};

export default {

  namespace: 'dimension',

  state: {
    list: [], // 选中维度的树详情
    dimension: [], // 维度列表
    addingStatus: '' // 添加维度的状态
  },

  subscriptions: {},

  effects: {
    *fetchList({ payload }, { call, put }) {  // eslint-disable-line
      const dimension = yield call(getDimensionList, payload);

      yield put({
        type: 'save',
        payload: {
          dimension
        }
      });
    },

    *deleteDimension({ payload: { id, appId } }, { call, put, select }) {
      const dimensionList = yield select((state) => state.dimension.dimension);

      yield call(delDimension, {
        appId,
        id
      });

      yield put({
        type: 'save',
        payload: {
          dimension: [...dimensionList.filter((item) => item.id !== id)]
        }
      });
    },

    *fetchDimensionDetail({ payload }, { call, put }) {  // eslint-disable-line
      const { dimensionId, appId } = payload;
      const list = yield call(getDimensionDetail, appId, dimensionId);

      yield put({
        type: 'save',
        payload: {
          list: getIdPathMap(list)
        }
      });
    },

    *addDimensionNode({ payload }, { call, put }) {
      const {
        dimensionId, node
      } = payload;

      if (node && node.isFake) {
        yield put({
          type: 'addRoot',
          payload: {
            dimensionId,
            node
          }
        });
      } else {
        const {
          path, children
        } = node;

        yield put({
          type: 'update',
          payload: {
            path,
            children
          }
        });
      }
    },

    *newDimension({payload}, { call, put, select }) {
      yield put({
        type: 'save',
        payload: {
          addingStatus: 'adding'
        }
      });

      let {
        dimeName,
        dimeKey,
        appId,
      } = payload;

      const data = yield call(addDimension, {
        name,
        dimeName,
        dimeKey,
        appId
      });
      const dimensionList = yield select((state) => state.dimension.dimension);

      yield put({
        type: 'save',
        payload: {
          dimension: [data, ...dimensionList],
          list: [],
          addingStatus: ''
        }
      });
    },

    *updateDimensionNode({ payload }, { call, put }) {
      let {
        isFake,
        id,
        dimeId,
        dimeNodeName,
        dimeNodeKey,
        remark,
        pid,
        appId,
        path,
      } = payload;

      if (isFake) {
        const data = yield call(addDimensionNode, {
          dimeNodeName,
          dimeNodeKey,
          remark,
          pid,
          appId,
          dimeId
        });
        id = data.id;
        isFake = false;
      } else {
        yield call(updateDimensionNode, {
          id,
          dimeNodeName,
          dimeNodeKey,
          remark,
          pid,
          appId,
          dimeId
        });
      }

      yield put({
        type: 'update',
        payload: {
          path,
          id,
          dimeNodeName,
          dimeNodeKey,
          remark,
          isFake,
        }
      });
    },

    *delDimensionNode({ payload }, { call, put, select }) {
      const {
        id,
        isFake,
        parent,
        appId,
      } = payload;

      if (!isFake) {
        yield call(delDimensionNode, {
          id,
          appId,
        });
      }

      if (parent) {
        const {
          path,
          children,
        } = parent;

        yield put({
          type: 'update',
          payload: {
            path,
            children: children.filter((item) => item.id !== id)
          }
        });
      } else {
        const list = yield select((state) => state.dimension.list);
        yield put({
          type: 'save',
          payload: {
            list: list.filter((item) => item.id !== id)
          }
        });
      }
    },

    *updateDimension({ payload: {id, dimeName, dimeKey, appId}}, {call, put, select}) {
      yield put({
        type: 'save',
        payload: {
          addingStatus: 'editing'
        }
      });

      const dimensionList = yield select((state) => state.dimension.dimension);

      const index = findIndex(dimensionList, ['id', id]);

      yield call(updateDimension, {
        id,
        appId,
        dimeName,
        dimeKey
      });

      dimensionList[index].dimeName = dimeName;
      dimensionList[index].dimeKey = dimeKey;

      yield put({
        type: 'save',
        payload: {
          dimension: [...dimensionList],
          addingStatus: ''
        }
      });
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    addRoot(state, { payload }) {
      const { dimensionId, node } = payload;
      const { list } = state;

      if (list.length === 0 || list[0].dimeId !== dimensionId) {
        return {
          ...state,
          list: [node]
        };
      }

      return {
        ...state,
        list: [node, ...list]
      };
    },
    update(state, { payload }) {
      const { list } = state;

      const {
        path,
        ...targets
      } = payload;

      let item = {};
      path.forEach((id, index) => {
        if (index === 0) {
          item = find(list, ['id', id]);
        } else {
          item = find(item.children, ['id', id]);
        }
      });

      Object.keys(targets).forEach((key) => {
        item[key] = targets[key];
      });

      return {
        ...state,
        list: getIdPathMap([...list])
      };
    }
  },
};
