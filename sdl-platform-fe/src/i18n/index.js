import { APP_LANG_ZH } from 'commons/constant'

function initLang() {
  const messages = {}
  const context = require.context('./messages', false, /language_\w+\.json$/)

  function grepLang(lang) {
    const end = lang.lastIndexOf('.')

    return lang.slice(11, end)
  }

  context.keys().forEach((lang) => {
    messages[grepLang(lang)] = context(lang)
  })

  return messages
}

export default {
  locale: APP_LANG_ZH,
  messages: initLang()
}
