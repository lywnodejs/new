function remove(array, item) {
  if (typeof item === 'function') {

    array.splice(_.findIndex(array, item), 1)
  } else {

    array.splice(_.findIndex(array, arr => arr === item), 1)
  }
}

export {
  remove
}
