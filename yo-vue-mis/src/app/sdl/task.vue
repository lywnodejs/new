<template>
    <div>
        <toggle-form title="sdl.task.title">
            <form-field label="sdl.task.task_create_time" for-id="task_create_time">
                <vue-datepicker-local v-model="begin_time" inputClass="form-control my-readonly"/>
                -
                <vue-datepicker-local v-model="end_time" inputClass="form-control my-readonly"/>
            </form-field>

            <form-field label="sdl.task.git_url" for-id="git_url">
                <input type="text" class="form-control" id="git_url"
                       v-model="git_url" :placeholder="$t('sdl.task.git_url')">
            </form-field>

            <form-field label="sdl.task.department" for-id="department">
                <AutoSelect v-model="dept_id" url="/sdl/dept"></AutoSelect>
            </form-field>

            <form-field label="sdl.task.rd" for-id="rd">
                <input type="text" class="form-control" id="rd"
                       v-model='rd' :placeholder="$t('sdl.task.rd')">
            </form-field>

            <form-field label="sdl.task.se" for-id="se">
                <input type="text" class="form-control" id="se"
                       v-model="se" :placeholder="$t('sdl.task.se')">
            </form-field>

            <form-field label="sdl.task.status" for-id="status">
                <b-form-select v-model="status" :options="SDL_TASK_STATUS" class="mb-3">
                    <template slot="first">
                        <option value="">{{$t('hint.select')}}</option>
                    </template>
                </b-form-select>
            </form-field>

            <form-field label="sdl.task.source_name" for-id="source">
                <b-form-select v-model="source" :options="sourceOptions" class="mb-3">
                    <template slot="first">
                        <option value="">{{$t('hint.select')}}</option>
                    </template>
                </b-form-select>
            </form-field>

            <form-action>
                <search-button :action="query" :status="searching"/>
                <button class="btn btn-secondary" @click="reset"><i class="fa fa-undo" aria-hidden="true"></i> {{$t('buttons.reset')}}</button>
            </form-action>

        </toggle-form>
        <search-table :url="url" @load="onload" ref="searchTable" :params="params">
             <b-table slot="table" bordered head-variant="light"
                      :items="items"
                      :show-empty="true"
                      :empty-text="$t('hint.no_record')"
                      :fields="fields">
                <template slot="action" slot-scope="row">
                    <b-button size="sm" @click.stop="row.toggleDetails">
                        {{ row.detailsShowing ? $t('buttons.toggleDetail') : $t('sdl.task.detail') }}
                    </b-button>
                    <router-link :to="{name : 'SdlVulner', params: {task_id : row.item.id, project_id : row.item.project_id}}" target="_blank">
                        {{$t('sdl.task.vulner')}}
                    </router-link>
                </template>
                <template slot="rd" slot-scope="data">
                    <template  v-if="data.value">
                        <div class="rd-max">
                         <a v-for="r in data.value" target="_blank" :key="r.email" :href="infoUrl(r.email)" class="pull-left">
                            {{r.name}}
                         </a>
                        </div>
                    </template>
                </template>
                <template slot="git_url" slot-scope="data">
                    <code>{{suffixGit(data.value)}}</code>
                </template>
                <template slot="status" slot-scope="data">
                    <b-button variant="outline-primary" size="sm" v-if="[1225, 1226].includes(data.value)" @click="checkTask(data.item)">
                        {{statusFmt(data.value)}}
                    </b-button>
                    <span v-else>
                        {{statusFmt(data.value)}}
                    </span>
                </template>
                <template slot="se" slot-scope="data">
                    <b-button v-if="data.value" target="_blank" :href="infoUrl(data.value.email)" variant="link"
                              v-b-popover.hover="data.value.department"
                              :title="data.value.email">
                        {{data.value.name}}
                    </b-button>
                </template>
               <template slot="row-details" slot-scope="row">
                   <row-detail :row-data="row"
                               :ignores="['status', 'odin_job_id', 'source', 'dept_id']"
                               :html="['rd', 'se', 'odin_job_url', 'odin_node', 'checkmax_url']"
                               :modules="['sdl.task']"
                               :singleRows="['odin_node']"
                               :formatters="formatters()"/>
                </template>
            </b-table>
        </search-table>

        <b-modal :no-close-on-backdrop="true" :title="$t('buttons.hint')" centered
                 v-model="modalShown"
                 :ok-title="$t('buttons.ok')"
                 @ok="checkOk"
                 @cancel="checkCancel"
                 :cancel-title="$t('sdl.task.check_task')">
             <p class="my-4 text-center" v-if="inAudit">{{$t('sdl.task.continue_audit')}}</p>
             <p class="my-4 text-center" v-else>{{$t('sdl.task.get_task')}}</p>
             <b-alert :show="!!actionHint" :variant="actionStatus">
                 {{actionHint}}
             </b-alert>
             <router-link v-if="task_id" v-show="false" id="actionHref" :to="{name : 'SdlAudit', params: {task_id : task_id, readonly : readonly}}" target="_blank">
                {{$t('buttons.checkOnly')}}
             </router-link>
        </b-modal>


    </div>
</template>
<style scoped>

</style>
<style lang="less" scoped>
.rd-max {
    max-width: 220px;
    >a {
        overflow-wrap: normal;
        margin-left: 5px;
        margin-right : 5px;
    }
}
</style>


<script>
import InitTableMixin from "commons/mixins/InitTableMixin.es6"
import {SDL_TASK_STATUS, GIT_PREFIX} from '@/constants.es6'
import TASK_CONFIG from './Task.es6'
import AutoSelect from 'commons/AutoSelect.vue'
import {suffixGit, odin_node, rd, infoUrl} from './utils.es6'

const AUDIT_URL = 'sdl/claim',
      reset = TASK_CONFIG.reset()

export default {

  name: "SDL-INDEX",

  mixins: [InitTableMixin],

  computed: {

    params: TASK_CONFIG.params(function () {
      if (this.source) {
        return {
          source: this.source
        }
      }
    }),

      actionStatus () {
          return this.actionResult ? 'success' : 'danger'
      },

      inAudit () {
          return this.task_status == 1226
      }
  },

  created () {
    this.getSelectOptions() // 获取数据来源数据字典
    let project_id = this.$route.params.project_id
    if(project_id) {
        this.url = `${this.url}?project_id=${project_id}`
    }
    this.SDL_TASK_STATUS = SDL_TASK_STATUS
  },

  components : {
    AutoSelect
  },

  data() {
      return Object.assign({
          url : 'sdl/queryScanTaskList',
          modalShown : false,
          task_id : null,
          task_status : null,
          readonly : false,
          //    操作提示
          actionHint : '',
          actionResult : false,

          source: '',
          sourceOptions: [] // 数据来源 add by huangxiaomei
      }, TASK_CONFIG.data())
  },

  methods: {

      suffixGit,

      infoUrl,

      reset,

      getSelectOptions() {
      let url = 'dictionary/listByDataAuth/1388'
      return new Promise((resolve, reject) => {
        this.$http.get(url).then(({ body }) => {
          let options = body.data.map(({ id: value, dName: text }) => {
            return {
              value,
              text
            };
          });
          this.sourceOptions = options
          resolve(body)
        })
      })
    },

      /**
       *
       */
      formatters () {
          return {
              rd,
              se (r, key) {
                  if(r && r.email) {
                      return `<a target="_blank" href="${infoUrl(r.email)}">${r.name}</a>`
                  }
                  return ''
              },
              odin_job_url (value, key) {
                  if(value) {
                      return `<a target="_blank" href="${value}">${value}</a>`
                  }
                  return ''
              },
              odin_node,
              checkmax_url (value, key) {
                if(value) {
                      return `<a target="_blank" href="${value}">${value}</a>`
                  }
                  return ''
              }
          }
      },

      statusFmt (status) {
          let i = 0,
              len = SDL_TASK_STATUS.length,
              fmt = ''
          for(; i < len; i ++) {
              if(SDL_TASK_STATUS[i].value == status) {
                  fmt = SDL_TASK_STATUS[i].text
              }
          }
          return fmt
      },

      checkTask (item) {
          let id = item.id
          this.modalShown = true
          this.task_id = id
          this.task_status = item.status

          this.readonly = true
          //   打开窗口时清除信息
          this.actionHint = ''
      },

      openAudit () {
          let   taskId = this.task_id,
                readonly = this.readonly ? 1 : 0,
                url = `/project/mis/sdl.html#/sdl-audit/${taskId}/${readonly}`
          window.open(url, '_blank')
      },

      /**
       * 确认认领
       */
      checkOk (bvEvt) {
          bvEvt.preventDefault()
          //    提交数据
          let task_id = this.task_id
          if(this.task_status === 1226) {
               this.readonly = false
               this.openAudit(task_id, false)
               this.modalShown = false
          } else {
              this.$http.post(AUDIT_URL, {
                    task_id
              }, {
                    emulateJSON : true
                }).then(rsp => {
                    const datas = rsp.body
                    if(datas.errno == 0) {
                        this.actionResult = true
                        this.readonly = false
                        this.actionHint = this.$t('hint.success')
                        //  操作成功
                        this.$nextTick(() => {
                            this.openAudit(task_id, false)
                            this.modalShown = false
                            this.query()
                        })
                    } else {
                        this.actionResult = false
                        this.readonly = true
                        this.actionHint = this.$t(`sdl.task.${datas.errno}`)
                    }
                })
          }
      },

      checkCancel () {
          this.readonly = true
          this.$nextTick(() => {
              this.openAudit()
          })
      }
  }
}
</script>
