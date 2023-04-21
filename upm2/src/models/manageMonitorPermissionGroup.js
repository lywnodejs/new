import { routerRedux } from 'dva/router';
import {
  getGroups,
  deleteGroup,
  getOdinNSTree,
  getOdinApprover,
  getSysRR,
  addNewGroup,
  getGroupInfo,
  modifyGroup
} from '../services/monitorPermissionGroup';


export default {

  namespace: 'monitorPermissionGroup',

  state: {
    list: [],
    sysList: [{
      id: 182,
      mark: 'odin',
      name: '系统监控 • ODIN'
    }, {
      id: 685,
      mark: 'woater',
      name: '业务监控 • Woater'
    }, {
      id: 302,
      mark: 'bamai',
      name: '日志监控 • 把脉'
    }],
    odinNSTree: [],
    odinRoles: [{
      id: 'user:beginner',
      name: '新手用户',
      mark: 'user:beginner'
    }, {
      id: 'user:nomal',
      name: '普通用户',
      mark: 'user:nomal'
    }, {
      id: 'user:senior',
      name: '高级用户',
      mark: 'user:senior'
    }, {
      id: 'user:manager',
      name: '管理员用户',
      mark: 'user:manager'
    }],
    woaterRegionTree: [],
    woaterRoleList: [],
    bamaiRoleList: [],
    groupInfo: {}
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const res = yield call(getGroups);

      const action = {
        type: 'save',
        payload: {
          list: res
        }
      };
      yield put(action);
      return res;
    },
    *redirect({ payload: { path }}, { put }) {
      yield put(routerRedux.push(path));
    },
    *deleteOneGroup({ payload: { groupIds }}, { call }) {
      return yield call(deleteGroup, { groupIds });
    },
    *fetchOdinTree({ payload: { search } }, { call, put }) {
      const res =  yield call(getOdinNSTree, { search });
      let tree = [];
      if (res &&
        res.children &&
        res.children[0] &&
        res.children[0].children &&
        res.children[0].children[0].children) {
        tree = res.children[0].children[0].children;
      }
      const action = {
        type: 'save',
        payload: {
          odinNSTree: tree
        }
      };
      yield put(action);
      return tree;
    },
    *fetchOdinApprover({ payload: { role, nsList } }, { call }) {
      return yield call(getOdinApprover, { role, nsList });
    },
    *fetchSysSub({ payload: { sysId, key }}, { call, put }) {
      const res = yield call(getSysRR, { sysId, key});
      const keyMap = ['woaterRegionTree', 'woaterRoleList', 'bamaiRoleList'];
      const action = {
        type: 'save',
        payload: {
          [keyMap[(sysId === 685 ? (key === 'role' ? 1 : 0) : 2)]]: res
        }
      };
      yield put(action);
      return res;
    },
    *addNewGroup({ payload: { name, desc, group }}, { call }) {
      const res =  yield call(addNewGroup, { name, desc, group });
      return res;
    },
    *fetchGroupInfo({ payload: { groupId }}, { call, put}) {
      const res = yield call(getGroupInfo, { groupId });
      let info = {
        ...res,
        groups: res.groups.map(item => ({
          ...item,
          params: {
            ...item.params,
            namespace: item.params.namespace ? [item.params.namespace] : []
          }
        }))
      }
      const action = {
        type: 'save',
        payload: {
          groupInfo: info
        }
      };
      yield put(action);
      return info.groups;
    },
    *resetGrroupInfo({ payload }, { put }) {
      const action = {
        type: 'save',
        payload: {
          groupInfo: {}
        }
      };
      put(action);
    },
    *modifyGroup({ payload: { id, name, desc, group }}, { call }) {
      return yield call(modifyGroup, { id, name, desc, group });
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload
      };
    }
  }
};
