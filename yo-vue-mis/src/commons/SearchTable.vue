<template>
    <section class="search-table">
        <slot name="table">
        </slot>
        <div class="row" style="padding : 0 15px;">
            <div class="col-sm-6">
                <b-pagination :total-rows="totalRows"
                              :per-page="size"
                               v-model="currentPage"
                               class="my-0"
                               @input="gotoPage"
                               @change="refresh">
                </b-pagination>
            </div>

            <div class="col-sm-6">
                <p class="text-right page-hint">{{$t('buttons.pageHint', [totalRows, totalPages])}}</p>
            </div>
        </div>
    </section>
</template>

<script>
    import Vue from 'vue'
    export default {
        props: {
            url: {
                type : String,
                default : null
            },

            params : {
                type : Object,
                default () {
                    return {}
                }
            },

            reload : {
                type : Function,
                default : null
            },

            extract : {
                type : Function,
                default : null
            }

        },

        data () {
            return {
                currentPage : 1,
                totalRows : 0,
                size : 10,
            }
        },

        created () {
            this.$on('refresh', this.refresh)
        },

        computed: {

            totalPages () {
                return Math.ceil(this.totalRows / this.size)
            }
        },

        methods: {

            gotoPage (currPage) {
                //console.log(currPage)
            },
            /**
             *  改变页码时处理，默认处理
             */
            refresh (currPage = 1) {
                let size = this.size,
                    page = currPage,
                    params = Object.assign({
                        size,
                        page
                    }, this.params)
                //  提交请求
                this.$http.get(this.url, {
                    params
                }).then(rsp => {
                    let datas = rsp.body
                    if(this.extract) {
                        datas = this.extract(rsp)
                    }
                    this.totalRows = datas.total
                    this.$nextTick(() => {
                      this.$emit('load', datas.data, datas)
                    })

                })
            }
        },
    }
</script>

<style scoped>
    .page-hint {
        height : 38px;
    }
</style>
