
<template>
    <div>
        <p class="page-title" v-if="auditable">
            <strong>{{$t('sdl.vulner.title')}}</strong>
            <a :href="checkmax_url" target="_blank" class="pull-right">{{$t('sdl.vulner.checkmax_url')}}</a>
        </p>
         <b-modal :no-close-on-backdrop="false" :title="$t('buttons.hint')" centered
                  :cancel-disabled="true"
                  footer-class="text-center"
                  :ok-title="$t('buttons.sure')"
                  cancel-variant="hide"
                  v-model="modalShown">
            <p class="my-4 text-center"> {{actionHint}}</p>
         </b-modal>

         <b-alert :show="dismissCountDown"
             style="float:right;width:500px;"
             dismissible
             variant="info"
             @dismissed="dismissCountDown=0"
             @dismiss-count-down="countDownChanged">
            <p>{{$t('hint.processing')}}</p>
            <b-progress variant="success"
                        :max="dismissSecs"
                        :value="dismissCountDown"
                        height="4px">
            </b-progress>
        </b-alert>
        
        <search-table :url="url" @load="onload" ref="searchTable" :params="params" :extract="extract">
             <b-table slot="table" bordered head-variant="light"
                     :show-empty="true"
                      :empty-text="$t('hint.no_record')"
                      :items="items"
                      :fields="fields">
                <template slot="type_name" slot-scope="data">
                    <span>{{auditable?data.item.type2_name : data.item.type_name}}</span>
                </template>
                <template slot="sf_path" slot-scope="data">
                    <span  v-html="formatCode(data.value, data.item.sf_line)"></span>
                </template>
                <template slot="status" slot-scope="data">
                    <span v-if="readonly || data.item.completed">{{fmtStatus(data.value)}}</span>
                    <b-form-select v-model="vulns[data.item.id]" :options="SDL_AUDIT_STATUS" @change="audit(data.item)" v-else>
                    </b-form-select>
                </template>
                <template slot="df_path" slot-scope="data">
                    <span  v-html="formatCode(data.value, data.item.df_line)"></span>
                </template>
                <template slot="action" slot-scope="row">
                    <a :href="row.item.checkmax_url" target="_blank" v-if="auditable">{{$t('buttons.link')}}</a>
                    <b-button size="sm" @click.stop="row.toggleDetails" v-else>
                        {{ row.detailsShowing ? $t('buttons.toggleDetail') : $t('buttons.showDetail') }}
                    </b-button>                    
                </template>
                <template slot="row-details" slot-scope="row">
                   <row-detail :row-data="row"
                               :modules="['sdl.vulner', 'sdl.task']"/>
                </template>
            </b-table>
        </search-table>

        <div class="text-center" v-if="auditable && !readonly">
            <button class="btn btn-primary" @click="auditTask" :disabled="processing">{{$t('buttons.audit')}}</button>
        </div>
    </div>
</template>


<script>
import InitTableMixin from "commons/mixins/InitTableMixin.es6"
import VULNER_CONFIG from './Vulner.es6'
import {SDL_AUDIT_STATUS} from '@/constants.es6'

export default {

    props : {
        history : {
            type : Boolean,
            default : false
        }
    },

  name: "SDL-VULNER",

  mixins: [InitTableMixin],

  computed: {

      params : VULNER_CONFIG.params(),

      actionClass () {
          return this.actionStatus ? 'success' : 'danger'
      },

      url () {
          let task_id = this.$route.params.task_id,
              project_id = this.$route.params.project_id,
              hist_url = 'sdl/queryHistoryVulnsList',
              task_url = 'sdl/queryVulnsList'
          //    判断审计节点
          if(this.auditable) {
              task_url = 'sdl/queryAuditVulnsList'
          }
          //    判断任务ID
          if(!!task_id) {
              //    可以优化
              const suffix = `?task_id=${task_id}`
              task_url = task_url + suffix
          }
          //  判断项目地址
          if(!!project_id) {
              const suffix = `?project_id=${project_id}`
              hist_url = hist_url + suffix
          }
          return this.history ? hist_url : task_url 
      },

      auditable () {
          return this.routeName === 'SdlAudit'
      }
  },

  created () {
      this.routeName = this.$route.name
      this.readonly = this.$route.params.readonly == 1 ? true : false
      //    只有于审计功能
      this.task_id = this.$route.params.task_id
      if(this.auditable) {
        this.fields[5].label = this.$t('sdl.task.checkmax_url')
        this.fields.splice(6, 0, {
            key : "status",
            label : this.$t('sdl.task.status'),
            tdClass : "text-center",
            thClass : "text-center"
        })
      }
  },

  data() {
      let datas = VULNER_CONFIG.data()     
      return Object.assign({
          SDL_AUDIT_STATUS,
          modalShown : false,
          readonly : true,
          vulns : null,
          checkmax_url : '',
          actionStatus : true,
          actionHint : '',
          dismissCountDown : 0,
          dismissSecs : 4,
          processing : false
      }, datas)
  },

  methods: {
      
      formatCode (value, num) {
          let idx = value.lastIndexOf('/'),
              code = value.substr(idx + 1)
          return `<code>${code}</code> <i class="text-info">[${num}]</i>`
      },

      /**@augments */
      fmtStatus (status) {
          for(let i = 0, len = SDL_AUDIT_STATUS.length; i < len; i++) {
              if(SDL_AUDIT_STATUS[i].value == status) {
                  return SDL_AUDIT_STATUS[i].text
              }
          }
          return ''
      },
      
      /**
       * 返回的数据需要进行转换
       * 
       */
      extract (rsp) {
          if(this.auditable) {
              let body = rsp.body,
                  datas = body.data,
                  total = datas.total,
                  items = datas.vulns || [],
                  vulns = {}
                // 记录初始数据
            items.forEach(item => {
                vulns[item.id] = item.status
                item.completed = false
            })
            this.vulns = vulns
            this.checkmax_url = datas.checkmax_url
            //
            return {
                total,
                data : items
            }
          } else {
              return rsp.body
          }
          
      },

      audit (item) {
          //  等数据刷新到 域对象后 进行提交
          this.$nextTick(() => {
              const vuln_id = item.id,
                    task_id = this.task_id,
                    status = this.vulns[item.id],
                    AUDIT_URL = 'sdl/changeVulnAuditStatus'
              this.$http.post(AUDIT_URL, {
                    task_id,
                    vuln_id,
                    status
              }, {
                    emulateJSON : true
              }).then(rsp => {
                  const datas = rsp.body
                  if(datas.errno == 0) {
                      this.actionStatus = true
                      this.actionHint = this.$t('sdl.vulner.success_vulner')
                  } else if(datas.errno == 1005){
                      // 禁止再修改
                      item.completed = true
                      this.actionStatus = false
                      this.actionHint = this.$t('sdl.vulner.complete')
                      this.modalShown = true
                  } else {
                      this.actionStatus = false
                      this.actionHint = this.$t('sdl.vulner.1007')
                      this.modalShown = true
                  }
              })
          })
          
      },

      auditTask () {
          const AUDIT_URL = 'sdl/commitVulnAuditResult',
                task_id = this.task_id
          // 准备进度条
          
          this.dismissCountDown = this.dismissSecs
          this.processing = true
          this.$http.post(AUDIT_URL, {
                task_id
          }, {
              emulateJSON : true
          }).then(rsp => {
              const datas = rsp.body,
                    errno = datas.errno
               if(datas.errno == 0) {
                    this.actionStatus = true
                    this.actionHint = this.$t('sdl.vulner.success_vulner')                  
               } else {
                    this.actionStatus = false
                    this.actionHint = this.$t(`sdl.vulner.${errno}`)
                    this.modalShown = true
               }  
               this.dismissCountDown = 0
               this.processing = false
          })
      },

      countDownChanged (dismissCountDown) {
        this.dismissCountDown = dismissCountDown
      }
      
  }
}
</script>