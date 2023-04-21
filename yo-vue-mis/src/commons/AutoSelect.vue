<template>
    <div class="dropdown">
        <input type="text" class="form-control" v-model="inputHint">
        <input type="hidden" :value="value" ref="input">
        <div class="dropdown-menu full-drop-menu" :class="{'show' : shown && depts && depts.length > 0}">
            <a class="dropdown-item" href="javascript:void(0)" @click="selectItem(item)" v-for="item in depts" :key="item.value || item.id">{{item.label || item.name + '（' + item.email + '）'}}</a>
        </div>
    </div>
</template>
<style scoped>
.full-drop-menu {
  width: 100%;
  max-height: 250px;
  overflow-y: auto;
}
</style>
<script>
export default {

    props: ['value', 'url', 'paramName', 'paramReset'],

    data() {
        return {
            depts: [],
            changed: false,
            shown: false,
            inputHint: ''
        }
    },

    watch: {
        paramReset(val, oldVal) {
            if (this.paramReset) {
                this.inputHint = ''
            }
        },

        inputHint(val, oldVal) {
            const url = this.url
            let paramsData = {}
            if (this.paramName) {
                paramsData[this.paramName] = val
            } else {
                paramsData = {
                    name: val
                }
            }
            if (val.length > 0 && !this.changed) {
                this.$http.get(url, {
                    params: paramsData
                }).then(rsp => {
                    let datas = rsp.body.data || rsp.body
                    this.depts = datas
                    this.shown = true
                })
            }
            this.changed = false
        }
    },

    methods: {

        selectItem(item) {
            this.inputHint = item.label || item.name + '（' + item.email + '）'
            this.$refs.input.value = item.value || item.id
            this.shown = false
            this.changed = true
            this.$emit('input', item.value || item.id)
        }
    },
}
</script>