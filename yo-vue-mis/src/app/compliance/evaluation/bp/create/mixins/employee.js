const separator = '&'

export default {
  methods: {

    /**
     * 初始化下拉框
     * @param {*} fields
     */
    initOption(fields) {
      fields.forEach(field => {
        const value = this.value[field]

        if (value) {
          this[field+'Options'] = value.map(emp => {
            const [user_id, user_name, user_email] = emp.split(separator)

            return {
              value: emp,
              label: user_name + '(' + user_email+ ')'
            }
          })
        }
      })
    },


    /**
     * 格式化接口数据
     * @param {*} emp
     */
    formatEmployee(emp) {
      return {
        value: emp.id + separator + emp.name + separator + emp.email,
        label: emp.name + '(' + emp.email+ ')'
      }
    },

    /**
     * 查询匹配人员信息
     */
    empSearch(query, options, format) {
      if(query !== '') {
        this.$http.get('secEvent/searchEmpList', {params: {'account': query}}).then(res => {
          if (res.data.errno == 0) {
            this[options] = []
            this[options] = res.data.data.map((item) => {
              return this.formatEmployee(item)
            })
          } else {
            this[options] = []
          }
        })
      } else {
        this[options] = []
      }
    },

    validate(callback) {
      this.$refs[this.formName].validate(callback)
    }
  }
}
