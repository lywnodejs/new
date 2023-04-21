import {
  getPackage,
  getCities,
  getUserInfo,
  postAll,
} from '../services/fastApply';

function toTreeData(curList) {
  return curList.map(city => {
    let returnObj = {
      title: city.name,
      value: city.idStr,
      key: city.idStr,
      disabled: city.disableCheckbox
    };
    if (city.hasOwnProperty('children') && city.children) {
      returnObj.children = toTreeData(city.children);
    }
    return returnObj;
  });
}
function toCheckboxGroupData(data) {
  return data.map(ele => ({
    label: ele.name + '(' + ele.description + ')',
    value: ele.id,
    disabled: ele.apply,
  }));
}

export default {
  namespace: 'fastApply',
  state: {
    emailPrefix: '',
    name: '',
    department: '',
    cities: [],
    package: [],
    origionCity: [],
  },
  reducers: {
    updateCities(state, { payload }) {
      return {
        ...state,
        cities: toTreeData(payload.data),
        origionCity: payload.data,
      };
    },
    updateUserInfo(state, { payload }) {
      const { email, usernameZh, deptDescr0 } = payload;
      let department = deptDescr0;
      if (payload.hasOwnProperty('deptDescr1') && payload.deptDescr2) {
        department += '-' + payload.deptDescr1;
        if (payload.hasOwnProperty('deptDescr2') && payload.deptDescr2) {
          department += '-' + payload.deptDescr2;
        }
      }
      return {
        ...state,
        emailPrefix: email.split('@')[0],
        name: usernameZh,
        department,
      };
    },
    updatePackage(state, { payload }) {
      return {
        ...state,
        package: toCheckboxGroupData(payload),
      };
    },
  },
  effects: {
    *getCities(_action, { put, call }) {
      const data = yield call(getCities);
      yield put({ type: 'updateCities', payload: { data } });
    },
    *getUserInfo(_action, { put, call }) {
      const data = yield call(getUserInfo);
      yield put({ type: 'updateUserInfo', payload: data });
    },
    *getPackage(_action, { put, call }) {
      const data = yield call(getPackage);
      yield put({ type: 'updatePackage', payload: data });
    },
    *apply({ payload }, { call }) {
      try {
        const result = yield call(postAll, payload);
        return {
          success: true,
          result,
        };
      } catch (error) {
        return {
          success: false,
          result: error.message,
        };
      }
    },
  },
};
