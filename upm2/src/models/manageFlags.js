import { find } from 'lodash';
import {
  getFlagList,
  addFlag,
  updateFlag,
  delFlag,
  relevantUser,
  unRelevantUser,
  clearRelevantUser,
  getRelevantUser,
  updateRoleFlag,
  fetchBindFlagRoleList
} from '../services/manageFlags';

const getIdPathMap = (list, path = []) => {
  return list.map((item) => {
    item.path = path.concat(item.id);
    if (item.children) {
      item.children.forEach((child) => child.parent = item);
      getIdPathMap(item.children, item.path);
    }
    return item;
  });
};

export default {

  namespace: 'flags',

  state: {
    list: [],
    flagBindRoles: []
  },

  subscriptions: {},

  effects: {
    *fetch ({ payload }, { call, put }) {  // eslint-disable-line
      const list = yield call(getFlagList, payload);

      yield put({
        type: 'save',
        payload: {
          list: getIdPathMap(list)
        }
      });
    },

    *addFakeFlag ({ payload }, { put }) {
      const {
        isFake, path, children
      } = payload;

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

    // *addFlag({ payload }, { call, put }) {
    //   yield call(addFlag, payload);
    //   yield put({
    //     type: 'fetch',
    //     payload: payload.appId
    //   });
    // },

    *updateFlag ({ payload }, { call, put }) {
      let {
        isFake,
        id,
        name,
        nameZh,
        pid,
        appId,
        path,
        riskLevel,
        isApplicable
      } = payload;

      if (isFake) {
        const data = yield call(addFlag, {
          name,
          nameZh,
          pid,
          appId,
          riskLevel,
          isApplicable
        });
        id = data.id;
        isFake = false;
      } else {
        yield call(updateFlag, {
          id,
          name,
          nameZh,
          pid,
          appId,
          riskLevel,
          isApplicable
        });
      }

      yield put({
        type: 'update',
        payload: {
          path,
          id,
          name,
          nameZh,
          isFake,
          riskLevel,
          isApplicable
        }
      });
    },

    *delFlag ({ payload }, { call, put, select }) {
      const {
        id,
        isFake,
        parent,
        appId
      } = payload;

      if (!isFake) {
        yield call(delFlag, {
          id,
          pid: parent ? parent.id : 0,
          appId
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
        const list = yield select((state) => state.flags.list);
        yield put({
          type: 'save',
          payload: {
            list: list.filter((item) => item.id !== id)
          }
        });
      }
    },
    *relevantUser ({ payload }, { call }) {
      return yield call(relevantUser, payload)
    },
    *unRelevantUser ({ payload }, { call }) {
      return yield call(unRelevantUser, payload)
    },
    *clearRelevantUser ({ payload }, { call }) {
      return yield call(clearRelevantUser, payload)
    },
    *getRelevantUser ({ payload }, { call, take }) {
      let { appId } = payload;
      if (!appId) {
        const takeAction = yield take('global/selectAvailableAppToManage');
        appId = takeAction.payload.appId;
      }

      return yield call(getRelevantUser, {
        appId,
        ...payload
      })
    },
    *updateRoleFlag ({ payload }, { call }) {
      return yield call(updateRoleFlag, payload)
    },
    *fetchBindFlagRoleList ({ payload }, { call, put }) {
      const flagBindRoles = yield call(fetchBindFlagRoleList, payload)

      yield put({
        type: 'save',
        payload: {
          flagBindRoles
        }
      })
    }
  },

  reducers: {
    save (state, action) {
      return { ...state, ...action.payload };
    },
    addRoot (state, action) {
      const { list } = state;

      return {
        list: [action.payload, ...list]
      };
    },
    update (state, { payload }) {
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
        list: getIdPathMap([...list])
      };
    }
  },
};
