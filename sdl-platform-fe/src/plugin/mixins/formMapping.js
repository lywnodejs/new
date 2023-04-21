export default function(source, form) {
  return {
    methods: {
      getFieldsValue(value, oldValue) {
        throw Error('Please override the "getFieldsValue" method')
      },
      setFieldsValue(value, oldValue) {
        throw Error('Please override the "setFieldsValue" method')
      }
    },
    watch: {
      [source](value, oldValue) {
        this.getFieldsValue(value, oldValue)
      },
      [form]: {
        handler(value, oldValue) {
          this.setFieldsValue(value, oldValue)
        },
        deep: true
      }
    },
    created() {
      this.getFieldsValue(this[source])
    }
  }
}
