import { getAdminusers } from '../services/interfacePerson'

export default {
  namespace: 'interfacePerson',
  state: {
    adminusers: []
  },
  effects: {
    *fetch ({ payload }, { call, put }) {
      const { appId } = payload
      const result = yield call(getAdminusers, {
        operateAppId: appId,
        appId
      })
      result.map(item => {
        return item.key = item.id
      })
      let results = []
      result.map(item => {
        if (item.isAdmin == 1) {
          results.push(item)
        }
      })
      yield put({
        type: 'save',
        payload: { adminusers: results }
      });

      return results
    },
    *reset (action, { put }) {
      yield put({
        type: 'save',
        payload: { adminusers: [] }
      });
    }
  },
  reducers: {
    save (state, action) {
      return { ...state, ...action.payload };
    },
  }
}
