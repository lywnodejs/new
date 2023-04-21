module.exports = Behavior({
  methods: {
    _isCompleted(value) {
      if (value === '') {
        return false;
      }
      return this._validate(value)
    },
    _validate(value) {
      let attribute = this.data.attribute;
      if (attribute.validate !== undefined && attribute.validate !== null && attribute.validate.jsExpression !== '' && attribute.validate.jsExpression !== null && attribute.validate.errMsg !== '' && attribute.validate.errMsg !== null) {
        var reg = RegExp(attribute.validate.jsExpression);
        var mat = value.match(reg);
        if (mat !== null) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    },
    _getErrorMsg() {
      let attribute = this.data.attribute;
      if (attribute.validate !== undefined && attribute.validate !== null && attribute.validate.jsExpression !== '' && attribute.validate.jsExpression !== null && attribute.validate.errMsg !== '' && attribute.validate.errMsg !== null) {
        return attribute.validate.errMsg;
      } else {
        return `请输入正确的${attribute.name}`;
      }
    }
  }
})