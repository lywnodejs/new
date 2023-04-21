
export const isStr2Number = str => str !== '' && !isNaN(Number(str))

export const handleQueryFields = (query) => {
  let ret = {}

  Object.keys(query).forEach(key => {
    let val = query[key]
    if (typeof val === 'boolean' || val) {
      ret[key] = val
    }
    if (Array.isArray(val)) {
      ret[key] = val.join()
    }
    if (typeof val === 'number' && !isNaN(val)) {
      ret[key] = val
    }
  })
  return ret
}

export const getUrlQuery = (name) => {
  const href = window.location.href
  const search = href.split('?')[1]
  if (!search) {
    return
  }
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  let r = search.match(reg)
  if (r != null) {
    return decodeURIComponent(r[2])
  }
  return null
}

export const resetWith = (target, source) => {
  Object.keys(target).forEach(key => {
    target[key] = source[key]
  })
}

const ccReg = /([\u4e00-\u9fa5]+)/g
export function getTextLen (text) {
  if (!text) {
    return 0
  }

  let len = text.length
  let ccLen = (text.match(ccReg) || []).join('').length

  return len - ccLen + ccLen * 2
}

export const isNumber = num => {
  const type = Object.prototype.toString.call(num).slice(8, -1).toLowerCase()
  if (type === 'string') {
    if (!num.trim()) return false
  } else if (type !== 'number') {
    return false
  }
  return (num - num + 1) >= 0
}

// 将true/false映射为1/0或反之
export const radioHandle = (value) => {
  if (typeof value === 'boolean') {
    return Number(value)
  } else if (typeof value === 'number') {
    return Boolean(value)
  }

  return null
}
export const handleRadio = (fields) => (formdata) => {
  return fields.forEach((field) => {
    formdata[field] = radioHandle(formdata[field])
  })
}

export function hasClass (el, cls) {
  if (!el || !cls) return false
  if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.')
  if (el.classList) {
    return el.classList.contains(cls)
  } else {
    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1
  }
}

export function addClass (el, cls) {
  if (!el) return
  let curClass = el.className
  const classes = (cls || '').split(' ')

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i]
    if (!clsName) continue

    if (el.classList) {
      el.classList.add(clsName)
    } else {
      if (!hasClass(el, clsName)) {
        curClass += ' ' + clsName
      }
    }
  }
  if (!el.classList) {
    el.className = curClass
  }
}

export function removeClass (el, cls) {
  if (!el || !cls) return
  const classes = cls.split(' ')
  let curClass = ' ' + el.className + ' '

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i]
    if (!clsName) continue

    if (el.classList) {
      el.classList.remove(clsName)
    } else {
      if (hasClass(el, clsName)) {
        curClass = curClass.replace(' ' + clsName + ' ', ' ')
      }
    }
  }
  if (!el.classList) {
    el.className = curClass.trim()
  }
}
