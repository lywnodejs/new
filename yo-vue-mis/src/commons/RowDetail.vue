<template>
    <b-card>
        <table class="detail-table table table-bordered">
            <tr v-for="(item, index) in items" :key="index">
                <td class="text-right td-label">{{$f(item[0].name)}}</td>
                <td class="text-left td-value" :colspan="item.length == 1 ? 3 : 1" v-if="html.includes(item[0].name)" v-html="item[0].value"></td>
                <td class="text-left td-value" :colspan="item.length == 1 ? 3 : 1" v-else>{{item[0].value}}</td>
                <template v-if="item.length == 2">
                    <td class="text-right td-label">{{$f(item[1].name)}}</td>
                    <td class="text-left td-value" v-if="html.includes(item[1].name)" v-html="item[1].value"></td>
                    <td class="text-left td-value" v-else>{{item[1].value}}</td>
                </template>
            </tr>            
        </table>
    </b-card>
</template>

<script>
    import {i18n} from '@/services.es6'
    const IGNORES = ['id', '_showDetails']
    export default {
        
        props : {
            rowData : {
                type : Object,
                default () {
                    return false
                }
            },

            ignores : {
                type : Array,
                default () {
                    return []
                }
            },

            singleRows : {
                type : Array,
                default () {
                    return []
                }
            },

            formatters : {
                type : Object,
                default () {
                    return {}
                }
            },

            html : {
                type : Array,
                default () {
                    return []
                }
            },
            //  国际化文本空间
            modules : {
                type : Array,
                default () {
                    return []
                }
            }
        },

        methods: {
            $f (key) {
                // 可优化，取国际化文字
                for(let i = 0, len = this.modules.length; i < len; i ++) {
                    let module = this.modules[i],
                        path = module + '.'+ key
                    if(i18n.te(path)) {
                        return i18n.t(path)
                    }
                }
                return key
            }
        },

        computed: {
            items () {
                const results = []
                if(this.rowData && this.rowData.item) {
                    //  复制一份，避免修改源数据
                    let items = Object.assign({}, this.rowData.item),
                        len = 0,
                        row = null
                    for(let prop in items) {
                        //  处理忽略
                        if(this.ignoreFields.includes(prop)) {
                            continue
                        }
                        //  处理格式化
                        if(this.formatters.hasOwnProperty(prop)) {                           
                            items[prop] = this.formatters[prop].call(items, items[prop], prop)
                        }
                        if(len % 2 == 0) {
                            if(row != null && row.length > 0) {
                                results.push(row)
                            }
                            row = []
                        }
                        //  单行单独处理
                        if(this.singleRows.includes(prop)) {
                            results.push([{
                                name : prop,
                                value : items[prop]
                            }])
                        } else {
                            row.push({
                                name : prop,
                                value : items[prop]
                            })
                            len ++;
                        }                        
                    }
                    // 放入最后的元素
                    if(row.length > 0) {
                        results.push(row)
                    }
                }
                return results 
            },

            ignoreFields () {
                this.ignores.forEach(item => {
                    IGNORES.push(item)
                })
                return IGNORES 
            }
        }      

    }
</script>

<style scoped>
    .td-label {
        width : 15%;
    }
    .td-value {
        width : 35%;
    }
</style>