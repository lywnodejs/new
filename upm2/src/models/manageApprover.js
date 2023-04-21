import {
  getApprover,
  updateApprover
} from '../services/manageApprover';

export default {

  namespace: 'manageApprover',

  state: {
    approverInfo: {
      dataUsernames: [],
      areaUseranmes: []
    }
  },

  effects: {
    *getApprover({ payload }, { call, put }) {
      const {
        dataUsernames,
        areaUseranmes
      } = yield call(getApprover, payload);

      yield put({
        type: 'save',
        payload: {
          approverInfo: {
            dataUsernames,
            areaUseranmes
          }
        }
      });
    },

    *updateApprover({ payload }, { call, put }) {
      yield call(updateApprover, payload);
    }
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    }
  }
}
