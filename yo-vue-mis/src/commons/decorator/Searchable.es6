import { i18n } from '@/services.es6'
import moment from 'moment'

export function Searchable(configs) {
    const module = configs.module
    return function (target) {
        /**
         * 迭代属性
         * @param callback
         */
        target.prototype.iterProps = function (callback) {
            //  可以优化new操作，已优化
            const inst = this,
                values = Object.entries(inst),
                fields = [],
                thClass = 'text-center'
            values.sort((a, b) => a.order - b.order)
            values.forEach(item => {
                let key = item[0],
                    value = item[1],
                    tdClass = value.align ? `text-${value.align}` : 'text-left',
                    //  获取默认值
                    labelKey = value.label ? value.label : `${module}.${key}`,
                    label = key === 'action' ? i18n.t(`buttons.${key}`) : i18n.t(labelKey)
                //  嵌入迭代方法
                callback(fields, {
                    key,
                    tdClass,
                    thClass,
                    label,
                    labelKey
                }, key, value)
            })
            return fields
        }

        /**
         * 计算表格头配置
         */
        target.prototype.fields = function () {
            return this.iterProps((fields, props, key, value) => {
                fields.push(props)
            })
        }

        /**
         * 计算需要绑定的对象，查询表单
         */
        target.prototype.model = function () {
            const domain = {}
            this.iterProps((fields, props, key, value) => {
                // 确定默认值
                let defaults = value.default,
                    search = value.search
                if (key === 'action' || search === false) {
                    return
                }
                if (search instanceof Array) {
                    search.forEach(item => {
                        domain[item] = defaults
                    })
                    return
                }
                if (typeof search == 'string') {
                    key = search
                }
                domain[key] = defaults
            })
            return domain
        }

        /**
         *
         */
        target.prototype.params = function (customCb) {
            const keys = Object.keys(this.model())
            return function () {
                let args = {}
                //  字段拷贝及转换
                keys.forEach(key => {
                    if(this[key] == null || this[key] === '') {
                        return
                    }
                    //  如果是日期
                    if (this[key] instanceof Date) {
                        args[key] = moment(this[key]).format('YYYY-MM-DD')
                        return
                    }
                    //
                    args[key] = this[key]
                })

                if (typeof customCb === 'function') {
                  
                  return Object.assign(
                            args,
                            customCb.call(this)
                          )
                }

                return args
            }
        }

        target.prototype.reset = function () {
            const keys = Object.keys(this.model())
            return function () {
                keys.forEach(key => {
                    this[key] = keys[key]
                })
            }
        }

        /**
         *
         */
        target.prototype.data = function () {
            let fields = this.fields()
            return Object.assign({ fields }, this.model())
        },

            target.prototype.generator = function () {
                let fields = []
                this.iterProps((f, props, key, value) => {
                    if (value.search === false) {
                        return
                    }
                    if (typeof value.search == 'string') {
                        value.key = value.search
                    }
                    fields.push(props)
                })
                return {
                    fields,
                    module
                }
            }
    }
}
