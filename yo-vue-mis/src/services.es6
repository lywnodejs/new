import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { NG_TRANSLATE_LANG_KEY } from './constants.es6'

import messages from './i18n/index.es6'

Vue.use(VueI18n)
export const i18n = new VueI18n({
    locale : window.localStorage.getItem(NG_TRANSLATE_LANG_KEY),
    messages
})
