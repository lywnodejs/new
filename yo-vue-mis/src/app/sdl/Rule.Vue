<template>
    <div>
        <p class="page-title">
            <strong class="pull-left">{{$t('sdl.rule.title')}}</strong>
            <div class="pull-right">
                <button class="btn btn-primary" @click="openDialog">规则导入</button>
                <a class="btn btn-outline-primary" href="/sdl/downloadRuleFile">规则导出</a>
            </div>
            <div class="clearfix"></div>
        </p>

        <b-modal :no-close-on-backdrop="true" :title="$t('buttons.upload')" centered
                  :cancel-disabled="true"
                  footer-class="text-center"
                  :ok-title="$t('buttons.sure')"
                  :ok-disabled="disabled"
                  @ok="upload"
                  cancel-variant="hide"
                  v-model="modalShown">
            <div class="mt-3">
                 <b-form-file id="upload_file" :placeholder="$t('hint.upload')" v-model="filename" :choose-label="$t('buttons.chooseFile')"></b-form-file>
                 <b-alert variant="danger" :show="!actionResult" style="margin-top : 15px;">{{actionHint}}</b-alert>
                 <p v-if="filename">{{$t('buttons.files')}}: {{filename.name}}</p>
            </div>
         </b-modal>

        <search-table url="sdl/queryRuleList" @load="onload" ref="searchTable" :params="params">
             <b-table slot="table" bordered head-variant="light"
                      :show-empty="true"
                      :empty-text="$t('hint.no_record')"
                      :items="items"
                      :fields="fields">
                <template slot="action" slot-scope="row">
                    <b-button size="sm" @click.stop="row.toggleDetails">
                        {{ row.detailsShowing ? $t('buttons.toggleDetail') : $t('buttons.showDetail') }}
                    </b-button>
                </template>
                <template slot="row-details" slot-scope="row">
                   <row-detail :row-data="row"
                               :ignores="['type', 'evaluate']"
                               :modules="['sdl.rule', 'sdl.task']"/>
                </template>
            </b-table>
        </search-table>
    </div>
</template>

<script>
import InitTableMixin from "commons/mixins/InitTableMixin.es6";
import RULE_CONFIG from "./Rule.es6";
export default {
  name: "SDL-RULE",

  mixins: [InitTableMixin],

  computed: {
    params: RULE_CONFIG.params()
  },

  data() {
    return Object.assign(
      {
        modalShown: false,
        filename : null,
        actionResult : true,
        actionHint : '',
        disabled : true
      },
      RULE_CONFIG.data()
    );
  },

    watch: {
        filename (newValue, oldValue) {
            let file = newValue
            if(file) {
                const name = file.name,
                      suffix = name.substr(name.lastIndexOf('.') + 1),
                      upper = suffix.toUpperCase()
                console.log(name.indexOf('.') + 1)
                if(upper === 'XLSX' || upper === 'XLS') {
                    this.disabled = false
                    this.actionResult = true
                } else {
                    this.disabled = true
                    this.actionResult = false
                    this.actionHint = this.$t('hint.notXlsx')
                }
            }
        }
    },


  methods: {
    openDialog() {
        this.disabled = true
        this.modalShown = true
    },

    upload (bvEvt) {
       bvEvt.preventDefault()
       const form = new FormData(),
             UPLOAD_URL = 'sdl/uploadRuleFile',
             file = document.getElementById('upload_file').files[0]
       form.append('file', file)
       this.$http.post(UPLOAD_URL, form, {
                    emulateJSON : false
              }).then(rsp => {
                  const datas = rsp.body
                  if(datas.errno === 0) {
                      this.actionResult = true
                      this.$nextTick(() => {
                          this.modalShown = false
                      })
                  } else {
                      this.actionResult = false
                      this.actionHint = this.$t('hint.upload_fail')
                  }
              })
    }
  }
};
</script>
