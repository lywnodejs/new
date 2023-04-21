import { ZH } from '../../constants.es6'
import mapping from '../../i18n/mapping'

export default {
  methods: {
    translateByName(module, name, separator) {
        if (this.$i18n.locale === ZH) return name

        if (name && separator) {
          return name.split(separator).map(i => mapping[module][i] || i).join(separator)
        }
        return mapping[module][name] || name
    }
  }
}
