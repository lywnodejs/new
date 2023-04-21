import {
  getApps,
  getQueryList,
  getDataType,
  getAttrValues,
  getBusiness,
  getUserResource,
  relation,
  getRelevantUsers
} from '../services/dataResource';

export default {

  namespace: 'dataResource',

  state: {
    relevantUsers: [],
    loading: {
      loadingRelevantUsers: false,
      loadingRelation: false
    }
  },

  // subscriptions: {
  //   setup({ dispatch }) {
  //     dispatch({
  //       type: 'fetch',
  //     }).then(userInfo => {
  //       typeof waterMark !== 'undefined' && waterMark({
  //         systemId: 888,
  //         textStyle: 'rgba(0,0,0,0.05)',
  //         userId: userInfo.username
  //       })
  //     });
  //   },
  // },

  effects: {
    // *fetch(action, { call, put }) {
    //   const dataResource = yield call(getApps);
    //   yield put({
    //     type: 'save',
    //     payload: dataResource,
    //   });
    //   return dataResource
    // },
    *getApps({ payload }, { call }) {
      return yield call(getApps);
    },
    *getQueryList({ payload }, { call }) {
      return yield call(getQueryList,{...payload});
    },
    *getDataType({ payload }, { call }) {
      return yield call(getDataType,{...payload});
      // yield put({
      //   payload: appId
      // })
    },
    *getAttrValues({ payload }, { call }) {
      return yield call(getAttrValues,{...payload});
    },
    *getBusiness({ payload }, { call }) {
      return yield call(getBusiness);
    },
    *getUserResource({ payload }, { call }) {
      return yield call(getUserResource,{...payload});
    },
    *relation({ payload: { appId, userNames, addResourceIdList, removeResourceIdList } }, { call, put }) {
      yield put({
        type: 'saveLoading',
        payload: {
          loadingRelation: true
        }
      })
      try{
        const rst = yield call(relation,{appId, userNames, addResourceIdList, removeResourceIdList});
        return rst;
      } finally {
        yield put({
          type: 'saveLoading',
          payload: {
            loadingRelation: false
          }
        })
      }
      
    },
    *getRelevantUsers({ payload: { appId, resourceId, userNames } }, { call, put }) {
      yield put({
        type: 'saveLoading',
        payload: {
          loadingRelevantUsers: true
        }
      })
      try {
        const relevantUsers = yield call(getRelevantUsers,{appId, resourceId, userNames});
        yield put({
          type: 'save',
          payload: {
            relevantUsers
          }
        })
      } finally {
        yield put({
          type: 'saveLoading',
          payload: {
            loadingRelevantUsers: false
          }
        })
      }
    }
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    saveLoading(state,action) {
      return {
        ...state,
        loading: {
          ...state.loading,
          ...action.payload
        }
      }
    }
  },

};
