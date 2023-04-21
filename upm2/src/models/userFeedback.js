import {
  fetchFeedbackList,
  addFeedbackTrack,
  deleteFeedbackTrack,
  fetchFeedbackRecord,
  fetchNpsGradeList
} from '../services/userFeedback';

export default {
  namespace: 'userFeedback',

  state: {
    npsGradeList: []
  },

  effects: {
    *fetchFeedbackList ({ payload }, { call, put, take }) {
      if (!payload.appId) {
        const takeAction = yield take('global/selectAvailableAppToManage');
        payload.appId = takeAction.payload.appId;
      }
      yield put({
        type: 'save',
        payload: {
          loading: true
        }
      });

      const data = yield call(fetchFeedbackList, payload);
      yield put({
        type: 'save',
        payload: {
          ...data,
          loading: false
        }
      });
    },
    *fetchFeedbackRecord ({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          tableLoading: true
        }
      });

      const trackList = yield call(fetchFeedbackRecord, payload);
      yield put({
        type: 'save',
        payload: {
          trackList,
          tableLoading: false
        }
      });
    },
    *addFeedbackTrack ({ payload }, { call, put }) {
      const data = yield call(fetchFeedbackRecord, payload);
    },
    *deleteFeedbackTrack ({ payload }, { call, put }) {
      const data = yield call(deleteFeedbackTrack, payload);
    },
    *fetchNpsGradeList ({ payload }, { call, put }) {
      const list = yield call(fetchNpsGradeList)
      yield put({
        type: 'save',
        payload: {
          npsGradeList: list
        }
      })
    }
  },

  reducers: {
    save (state, action) {
      return { ...state, ...action.payload };
    }
  }
};