import Vue from 'vue'
import VueI18n from './translate'

export default function initI18n(i18n) {
  Vue.use(VueI18n)
  return new VueI18n({
    silentTranslationWarn: process.env.NODE_ENV === 'production',
    ...i18n
  })
}
