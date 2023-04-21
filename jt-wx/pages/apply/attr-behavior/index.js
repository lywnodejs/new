module.exports = Behavior({
  methods: {
 
    _hasUncompletedAttr(attrs) {
      for (const i in attrs) {
        let attr = attrs[i]
        if (!attr.completed && attr.mustFill == 1) {
          return true
        }
        if (attr.attrType === 'enum') {
          let selectAttr = attr.selectValue.find(selectItem => selectItem.value === attr.value)
          if (selectAttr !== null && selectAttr !== undefined) {
            let subAttrs = selectAttr.childList;
            if (subAttrs !== null && subAttrs !== undefined && subAttrs.length > 0) {
              for (const j in subAttrs) {
                let subAttr = subAttrs[j]
                if (!subAttr.completed && subAttr.mustFill == 1) {
                  return true
                }
              }
            }
          }
        }
      }
      return false;
    },

    _attrCanSave(attr) {
      if (!attr.editFlag) {
        return false
      }
      return attr.completed
    },

    _getParam(attr) {
      return {
        attrId: attr.id,
        attrValue: attr.value !== null && attr.value !== undefined ? attr.value : ""
      };
    },

  }
})