import {
  eventService
} from '../service/index'
import {
  SET_PARAMETER,
  SET_DEFAULT_INDEX
} from './mutation-types'

export default {
  async setDefaultIndex({ commit, state},value) {
    commit(SET_DEFAULT_INDEX, value);
  },
  async setParameter({ commit, state},value) {
    commit(SET_PARAMETER, value);
  }
}
