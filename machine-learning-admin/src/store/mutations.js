import {
  SET_DEFAULT_INDEX,
  SET_PARAMETER
} from './mutation-types.js'

export default {
  [SET_DEFAULT_INDEX](state, res) {
    state.activeIndex = res;
  },
  [SET_PARAMETER](state, res) {
    state.parameter = res;
  }
}
