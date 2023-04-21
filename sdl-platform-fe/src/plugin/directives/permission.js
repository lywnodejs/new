import { validate } from '@/models/user'

export default {
  bind(el, binding, vnode) {
    const val = binding.value

    if (val == '') return

    if (Array.isArray(val)) {
      for (let i = 0; i < val.length; i++) {
        if (validate(val[i])) {
          return
        }
      }
      el.style.display = 'none'
    } else {
      if (!validate(binding.value)) {
        el.style.display = 'none'
      }
    }
  }
}
