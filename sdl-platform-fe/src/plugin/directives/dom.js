export const errSrc = {
  inserted(el, {value}) {
    el.onerror = function() {
      el.src = value
      el.onerror = null
    }
  }
}

export const focus = {
  inserted(el) {
    el.focus()
  },
  update(el, {value}) {
    if (value) {
      el.focus()
    }
  }
}
