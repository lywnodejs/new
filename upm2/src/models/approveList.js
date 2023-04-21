import {
  getApprove,
  passApprove,
  rejectApprove,
  batchRejectApprove,
  batchPassApprove,
  getApprove2,
  isShowFeedbackModal,
  sendApproveNps
} from '../services/approve';
import { reportEvent } from '@services/stat.js';
import { calcApproveTime } from '@utils/stat.js';

export default {
  namespace: 'approveList',

  state: {
    list: {
      records: [],
      current: 0,
      total: 0
    },
    list2: {
      records: [],
      current: 0,
      total: 0,
      loading: false
    },
    visible: false,
    approveingCount: 0,
    loading: {
      passApprove: false,
      rejectApprove: false
    }
  },

  subscriptions: {
    setup({ dispatch, history }) {
      // eslint-disable-line
      dispatch({
        type: 'fetchApprove2',
        payload: {
          size: 0
        }
      });
    }
  },

  effects: {
    *fetchApprove({ payload }, { call, put, take }) {
      // eslint-disable-line
      let { approveStatuses } = payload;
      if (!approveStatuses) {
        const takeAction = yield take('global/saveEnumMap');
        approveStatuses = Object.keys(
          takeAction.payload.enumMap.workflowenums.approveStatus
        );
      }
      const approveList = yield call(getApprove, {
        approveStatuses,
        size: 20,
        ...payload
      });
      yield put({
        type: 'saveApprove',
        payload: approveList
      });
    },
    *passApprove({ payload }, { select, put, call }) {
      yield put({
        type: 'saveLoading',
        payload: {
          passApprove: true
        }
      });
      try {
        const response = yield call(passApprove, payload);
        const approveingCount = yield select(
          state => state.approveList.list2.approveingCount
        );
        yield put({
          type: 'save',
          payload: {
            approveingCount: approveingCount - 1 || 0
          }
        });
        return response;
      } catch (error) {
        return error.message;
      } finally {
        yield put({
          type: 'saveLoading',
          payload: {
            passApprove: false
          }
        });
      }
      // const response = yield call(passApprove, payload);

      // 上报审批时间
      const approveTime = calcApproveTime();
      yield call(reportEvent, {
        uri: 'new-approval-time',
        applyStatus: approveTime
      });

      // console.log('测试response是否有错',response);
      // return response;
    },
    *batchPassApprove({ payload }, { call }) {
      const response = yield call(batchPassApprove, payload);
      // 上报审批时间
      const approveTime = calcApproveTime();
      yield call(reportEvent, {
        uri: 'new-approval-time',
        applyStatus: approveTime
      });

      return response;
    },
    *rejectApprove({ payload }, { select, put, call }) {
      // const response = yield call(rejectApprove, payload);
      yield put({
        type: 'saveLoading',
        payload: {
          rejectApprove: true
        }
      });
      try {
        const response = yield call(rejectApprove, payload);
        const approveingCount = yield select(
          state => state.approveList.list2.approveingCount
        );
        yield put({
          type: 'save',
          payload: {
            approveingCount: approveingCount - 1 || 0
          }
        });
        return response;
      } catch (error) {
        return error.message;
      } finally {
        yield put({
          type: 'saveLoading',
          payload: {
            rejectApprove: false
          }
        });
      }
      // 上报审批时间
      const approveTime = calcApproveTime();
      yield call(reportEvent, {
        uri: 'new-approval-time',
        applyStatus: approveTime
      });

      // return response;
    },
    *batchRejectApprove({ payload }, { call }) {
      const response = yield call(batchRejectApprove, payload);
      // 上报审批时间
      const approveTime = calcApproveTime();

      yield call(reportEvent, {
        uri: 'new-approval-time',
        applyStatus: approveTime
      });

      return response;
    },
    *fetchApprove2({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          loading: true
        }
      });
      const approveList2 = yield call(getApprove2, {
        size: 20,
        ...payload
      });

      return yield put({
        type: 'save',
        payload: {
          ...approveList2,
          loading: false
        }
      });
    },
    *isShowFeedbackModal({ payload }, { call, put }) {
      const visible = yield call(isShowFeedbackModal);
      if (visible) {
        yield call(sendApproveNps, {
          category: 3
        });
      }
      yield put({
        type: 'saveModal',
        payload: {
          visible
        }
      });
    }
  },

  reducers: {
    saveApprove(state, { payload }) {
      return {
        ...state,
        list: {
          ...state.list,
          ...payload
        }
      };
    },
    save(state, { payload }) {
      return {
        ...state,
        list2: {
          ...state.list2,
          ...payload
        }
      };
    },
    saveModal(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    },
    saveLoading( state, { payload } ) {
      return {
        ...state,
        loading: {
          ...state.loading,
          ...payload
        }
      }
    }
  }
};
