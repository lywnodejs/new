import {
  getAllBlackCitiesId,
  getAllBlackCities,
  getSuggestionCities,
  addToBlacklist,
  rmFromBlacklist,
} from '../services/cityBlacklist';

import _ from "lodash";

export default {

  namespace: 'cityBlacklist',

  state: {
    list: [], // 黑名单列表
    suggestions: [], // 搜索建议城市
  },

  subscriptions: {
    // getList({ dispatch, history }) {
    //   return history.listen(({ pathname }, action) => {
    //     if (pathname === '/upm2-static/manage/city/blacklist') {
    //       dispatch({ type: 'fetchList' });
    //     }
    //   });
    // }
  },

  effects: {
    *fetchList({ payload: { appId } }, { call, put }) {
      const list = yield call(getAllBlackCitiesId, { appId });

      yield put({
        type: 'save',
        payload: {
          list
        }
      });
    },
    *addToList({ payload: { cityName, appId, cityId } }, { call, put, select }) {
      const record = yield call(addToBlacklist, { appId, areaId: cityId, name: cityName });

      const list = yield select(state => state.cityBlacklist.list);

      yield put({
        type: 'save',
        payload: {
          list: [
            ...list,
            record
          ]
        }
      });
    },
    *rmCities({ payload: { ids, appId } }, { call, put, select }) {
      const list = yield select((state) => state.cityBlacklist.list);

      const areaIdList = ids.map((id) => {
        const area = _.find(list, { id });

        return area.areaId;
      });

      yield call(rmFromBlacklist, {
        appId,
        areaIdList
      });

      const newList = _.filter(list, (item) => !~ids.indexOf(item.id));

      yield put({
        type: 'save',
        payload: {
          list: newList
        }
      });
    },
    *getSuggestions({ payload: {
      input,
      appId,
      businessId
    }}, { call, put }) {

      if (input === '') {
        yield put({
          type: 'save',
          payload: {
            suggestions: []
          }
        });
        return;
      }

      const cities = yield call(getSuggestionCities, {
        name: input,
        appId,
        businessId
      });

      yield put({
        type: 'save',
        payload: {
          suggestions: cities
        }
      });
    }
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    // addNewToList(state, { payload: { id } }) {
    //   const { list, suggestions } = state;
    //
    //   const city = _.find(suggestions, { id });
    //   console.log(suggestions, id)
    //   return {
    //     ...state,
    //     list: [
    //       ...list, {
    //         ...city,
    //         createdAt: Date.now()
    //       }
    //     ],
    //     suggestions: []
    //   };
    // },
  },
};
