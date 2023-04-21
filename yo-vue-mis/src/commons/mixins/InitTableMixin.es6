import ToggleForm from 'commons/ToggleForm.vue'
import SearchTable from 'commons/SearchTable.vue'
import FormField from 'commons/FormField.vue'
import FormAction from 'commons/FormAction.vue'
import SearchButton from 'commons/SearchButton.vue'
import RowDetail from 'commons/RowDetail.vue'
import VueDatepickerLocal from 'vue-datepicker-local'

export default {

    data () {
        return {
            searching : false,
            searchTime : 0,
            items : []
        }
    },

    components : {
        SearchTable,
        ToggleForm,
        FormField,
        FormAction,
        SearchButton,
        RowDetail,
        VueDatepickerLocal
    },

    mounted () {
        this.query()
    },

    methods: {

        onload (items, datas) {
            const OVER_TIME = 100
            let consumeTime = Date.now() - this.searchTime
            this.items = items
            if(consumeTime < OVER_TIME) {
                setTimeout(() => {
                    this.searching = false
                }, OVER_TIME)
            } else {
                this.searching = false
            }
        },

        query () {
            this.searching = true
            this.searchTime = Date.now()
            this.$nextTick(() => {
              this.$refs.searchTable.$emit('refresh')
            })
        }

    }

}
