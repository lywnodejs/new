import { getApplyList, recallApply } from '../services/apply';

const PAGE_SIZE = 20;

const defaultState = {
  records: [],
  current: 0,
  total: 0,
  loading: false
};

export default {
  namespace: 'applyList',

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
        type: 'save',
        payload: {
          ...defaultState,
          loading: true
        }
      });

      const data = yield call(getApplyList, {
        size: PAGE_SIZE,
        ...payload
      });

      yield put({
        type: 'save',
        payload: {
          ...data,
          loading: false
        }
      });
    },
    *recall(
      {
        payload: { applyId }
      },
      { call, put }
    ) {
      // eslint-disable-line
      yield call(recallApply, {
        applyId
      });

      yield put({
        type: 'delete',
        payload: {
          applyId
        }
      });
    },
    *batchRecall(
      {
        payload: { batchApplyId }
      },
      { call, put }
    ) {
      try {
        yield call(recallApply, {
          batchApplyId
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
    }
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    delete(state, { payload }) {
      const { records } = state;

      return {
        ...state,
        records: records.filter(item => item.id !== payload.applyId)
      };
    }
  }
};
