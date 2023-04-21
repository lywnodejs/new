
import {
    getIndicatorsTotal,
    getIndicatorsApp
  } from '../services/monitor';
  
  export default {
  
    namespace: 'monitor',
  
    state: {
      total: {},
      tableData: {}
    },
  
    effects: {
      *fetchTotal({}, { call, put, take }) {
        const total = yield call(getIndicatorsTotal);
  
        yield put({
          type: 'save',
          payload: {
            total
          },
        });
      },
      *fetechTable({payload: {size, page}}, { call, put, take }) {
        const tableData = yield call(getIndicatorsApp, {size, page});
  
        yield put({
          type: 'save',
          payload: {
            tableData
          },
        });
      },
    },
  
    reducers: {
      save(state, action) {
        return { ...state, ...action.payload };
      },
    },
  
  };
  