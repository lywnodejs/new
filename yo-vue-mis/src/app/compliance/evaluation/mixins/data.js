const dictUrl = 'dictionary/listByDataAuth/'

export default {
    data() {
        return {
            project: {
                business: [],
                follower: [],
                object: [],
                scope: []
            },

            deptOptions: [], // 业务部门选项
            empOptions: [], // 关注人选项
            contentOptions: [], // 评估内容选项
            stateOptions: [] // 状态选项
        }
    },

    methods: {

        /**
         * 格式化提交数据
         */
        formatDataById(fields, rowData) {
            let result = {}

            fields.forEach(field => {
                result[field] = rowData[field] ? rowData[field].map(user_id => { return { user_id } }) : []
            })

            return result
        },

        /**
         * 由于返回的数据和组件需要的数据格式不一致（多选下拉框)
         * 需要对数据格外处理，同时保留原始数据
         */
        fillOptionsByEmp(fields, rowData) {
            let result = {}

            fields.forEach(field => {
                result[field] = rowData[field] ? rowData[field].map(item => item.user_id) : []
                result['_' + field] = rowData[field]
            })

            return result
        },

        /**
         * 查询业务部门
         */
        deptSearchList(query) {
            if (query !== '') {
                this.$http.get('sdl/dept', { params: { 'name': query } }).then(res => {
                    if (res.status == 200) {
                        this.deptOptions = []
                        this.deptOptions = res.data
                    } else {
                        this.deptOptions = []
                    }
                })
            } else {
                this.deptOptions = []
            }
        },

        /**
         *
         * @param {*} emp
         */
        formatByEmpStr(emp) {
            const separator = '&'
            const [user_id, user_name, user_email] = emp.split(separator)

            return {
                user_id,
                user_name,
                user_email
            }
        },

        /**
         * 用于格式化提交数据
         */
        formatData(fields, obj) {
            let result = {}

            fields.forEach(field => {
                result[field] = obj[field].map(emp => {
                    return this.formatByEmpStr(emp)
                })
            })
            return result
        },

        /**
         * 查询关注人
         */
        empSearchList(query) {
            if (query !== '') {
                this.$http.get('secEvent/searchEmpList', { params: { 'account': query } }).then(res => {
                    if (res.data.errno == 0) {
                        this.empOptions = res.data.data.map((item) => {
                            return {
                                user_id: item.id,
                                user_name: item.name + '(' + item.email + ')'
                            }
                        })
                    } else {
                        this.empOptions = []
                    }
                })
            } else {
                this.empOptions = []
            }
        },

        /**
         * 获取评估内容
         */
        getDictByContent() {
            this.$http.get(dictUrl + 1730).then(({ body }) => this.contentOptions = body.data)
        },

        /**
         * 获取项目基本详情
         */
        getEvaluationBase(id, source) {
            this.$http.get('sa/findInfo', { params: { id, source } }).then(({ body }) => {
                const data = body.data
                if (!data) {
                    return
                }
                if (data.feedback_enabled < 1000) {
                    data.feedback_enabled = 1851
                }
                if (data.assessment_self_enabled < 1000) {
                    data.assessment_self_enabled = 1851
                }
                const { follower, dept_name, dept_id, ...rest } = data

                this.project = {
                    dept_id,
                    ...this.project,
                    ...rest,
                    dept_name,
                    followerObj: follower,
                    follower: follower.map(item => item.user_id)
                }
                this.deptOptions = [{
                    label: dept_name,
                    value: dept_id
                }] // 设置部门下拉框
                this.empOptions = follower.map(item => {
                    return {
                        user_id: item.user_id,
                        user_name: item.user_name + '(' + item.user_email + ')'
                    }
                }) // 设置关注人下拉框
            })
        },

        /**
         * 查询评估业务列表
         */
        getBusinessList(project_id, source) {
            this.$http.get('sa/business/list', { params: { project_id, source } }).then(({ body }) => {
                this.project.business = body.data
            })
        },

        /**
         * 获取评估业务详情
         */
        getBusinessInfo(id) {
            return this.$http.get('sa/project/business/info', { params: { id } })
        },

        /**
         * 查询评估对象列表
         */
        getObjectList(project_id, source, stat = 0) {
            this.$http.get('sa/object/list', { params: { project_id, source, stat } }).then(({ body }) => {
                this.project.object = body.data
            })
        },
        /**
         * 数据启用状态
         */
        getDictDataStartState() {
            let that = this
            this.$http.get('/dictionary/listByDataAuth/' + 1850).then(({ body }) => {
                that.stateOptions = (body.data || []).map(item => {
                    item['label'] = item.dName
                    item['value'] = item.id
                    return item
                })
            })
        },
        /**
         * 获取评估对象详情
         */
        getObjectInfo(id) {
            return this.$http.get('sa/project/object/info', { params: { id } })
        },

        /**
         * 查询评估内容列表
         */
        getContentList(project_id, source, stat = 0) {
            this.$http.get('sa/assessment/list', { params: { project_id, source, stat } }).then(({ body }) => {
                this.project.scope = body.data.map(item => item.id)
            })
        },

        /**
         * 获取评估内容详情
         */
        getContentInfo(id) {
            return this.$http.get('sa/project/scope/info', { params: { id } })
        },
    }
}