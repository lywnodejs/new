/**
 * 创建自定义角色策略
 */

import _ from 'lodash';
import request from '../utils/request';

export default {

  namespace: 'newRoleStrategy',

  state: {
    params: {}
  },

  subscriptions: {
    setup({ dispatch }) {
      dispatch({
        type: 'fetch',
      });
    },
  },

  effects: {
    *fetch(action, { call, put }) {
      // let treeData = yield call(request, 'get-test-tree-data');
      let treeData = [];
      // let data = {};

      // let level1 = 10;
      // let level2 = 100;
      // let level3 = 50;

      // for(let i = 0; i < level1; i++) {
      //   let uid = _.uniqueId();
      //   data[i] = {
      //     id: uid,
      //     name: 'level1-' + i,
      //     children: {},
      //   };
      //   for (let j = 0; j < level2; j++) {
      //     let uid = _.uniqueId();
      //     data[i].children[j] = {
      //       id: uid,
      //       name: 'level2-' +j,
      //       children: {},
      //     };
      //     for (let k = 0; k < level3; k++) {
      //       let uid = _.uniqueId();
      //       data[i].children[j].children[k] = {
      //         id: uid,
      //         name: 'level3-' +k,
      //         children: null,
      //       };
      //     }
      //   }
      // }
      // let treeData = data;

      yield put({
        type: 'updateTreeData',
        payload: {
          treeData,
        }
      });
    },
  },

  reducers: {
    updateParams(state, { payload }) {
      return {
        ...state,
        params: {
          ...state.params,
          ...payload,
        }
      };
    },

    updateTreeData(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    }
  },

};
