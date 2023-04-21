<template>
    <div>
        <toggle-form title="sdl.project.title">
            
                <form-field label="sdl.project.create_time" for-id="create_time">
                     <vue-datepicker-local v-model="create_begin_time" inputClass="form-control my-readonly"/>
                     -
                     <vue-datepicker-local v-model="create_end_time" inputClass="form-control my-readonly"/>
                </form-field>
                        
                <form-field label="sdl.task.git_url" for-id="git_url">
                    <input type="text" class="form-control" id="git_url" 
                           v-model="git_url" :placeholder="$t('sdl.task.git_url')">
                </form-field>
            
                <form-field label="sdl.task.department" for-id="dept_id">
                    <AutoSelect v-model="dept_id" url="/sdl/dept"></AutoSelect>
                </form-field>

                <form-field label="sdl.project.last_check_time" for-id="last_check_time">
                     <vue-datepicker-local v-model="check_begin_time" inputClass="form-control my-readonly"/>
                     -
                     <vue-datepicker-local v-model="check_end_time" inputClass="form-control my-readonly"/>
                </form-field>            
        
            <form-action>
                <search-button :action="query" :status="searching"/>
                <button class="btn btn-secondary" @click="reset"><i class="fa fa-undo" aria-hidden="true"></i> {{$t('buttons.reset')}}</button>
            </form-action>

        </toggle-form>
        <search-table url="sdl/queryProjectList" @load="onload" ref="searchTable" :params="params">
             <b-table slot="table" bordered head-variant="light"
                      :items="items"
                      :show-empty="true"
                      :empty-text="$t('hint.no_record')"
                      :fields="fields">
                <template slot="action" slot-scope="row">
                    <b-button size="sm" @click.stop="row.toggleDetails">
                        {{ row.detailsShowing ? $t('buttons.toggleDetail') : $t('buttons.showDetail') }}
                    </b-button>
                    <router-link :to="{name : 'SdlProject', params: {project_id : row.item.id}}" target="_blank">
                        {{$t('sdl.project.task')}}
                    </router-link>
                    <router-link :to="{name : 'SdlHist', params: {project_id : row.item.id}}" target="_blank">
                        {{$t('sdl.project.vulner')}}
                    </router-link>
                </template>

                <template slot="git_url" slot-scope="data">
                    <code>{{suffixGit(data.value)}}</code> 
                </template>

                <template slot="row-details" slot-scope="row">
                   <row-detail :row-data="row"
                               :formatters="formatters()"
                               :ignores="['level']"
                               :html="['rd', 'odin_node']"
                               :modules="['sdl.task', 'sdl.project']"/>
                </template>
            </b-table>
        </search-table>
    </div>
</template>

<script>
import InitTableMixin from "commons/mixins/InitTableMixin.es6"
import PROJECT_CONFIG from './Project.es6'
import {suffixGit, odin_node, rd} from './utils.es6'
import AutoSelect from 'commons/AutoSelect.vue'

export default {

  name: "SDL-PROJECT",

  mixins: [InitTableMixin],

  computed: {
      params : PROJECT_CONFIG.params()
  },

  data() {
      return Object.assign({}, PROJECT_CONFIG.data())
  },

  components : {
      AutoSelect
  },

  methods: {

      suffixGit,

      reset : PROJECT_CONFIG.reset(),

      formatters () {
          return {
              odin_node,
              rd
          }
      }

  }
}
</script>