<template>
  <div class="notify-edit">
    <el-form label-width="120px" label-suffix="：">
      <el-row>
        <el-col>
          <el-form-item :label="$t('manage.notify.name')">
            <el-input v-model="value.name" :maxlength="100" @change="(value) => valueChangeHanlde(value, 'name')"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item :label="$t('manage.event_type')">
            <el-checkbox-group v-model="value.event_type_list" @change="(value) => valueChangeHanlde(value, 'event_type_list')">
              <el-checkbox v-for="item in eventOptions" :key="item.value" :label="item.value">{{translateByName('event', item.text)}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item :label="$t('manage.serious_level')">
            <el-checkbox-group v-model="value.event_level_list" @change="(value) => valueChangeHanlde(value, 'event_level_list')">
              <el-checkbox v-for="item in seriousOptions" :key="item.value" :label="item.value">{{translateByName('event', item.text)}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item :label="$t('manage.event_status')">
            <el-checkbox-group v-model="value.event_status_list" @change="(value) => valueChangeHanlde(value, 'event_status_list')">
              <el-checkbox v-for="item in statusList" :key="item.value" :label="item.value">{{translateByName('event', item.text)}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item :label="$t('manage.notify.user')">
            <el-select v-model="value.notify_user_list" @change="(value) => valueChangeHanlde(value, 'notify_user_list')"  multiple remote reserve-keyword :remote-method="empSearchList" :placeholder="$t('manage.select')" filterable style="width: 100%;" clearable>
              <el-option
                v-for="item in empOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item :label="$t('manage.notify.status')">
            <el-select v-model="value.status" @change="(value) => valueChangeHanlde(value, 'status')">
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default() {
        return {
          name: '',
          event_type_list: [],
          event_level_list: [],
          event_status_list: [],
          notify_user_list: [],
          status: ''
        }
      }
    }
  },
  data() {
    return {
      statusOptions: [
        {
          value: 1,
          label: this.$t('manage.enable')
        }, {
          value: 2,
          label: this.$t('manage.disable')
        }
      ],
      eventOptions: [],
      seriousOptions: [],
      statusList: [],
      empOptions: []
    }
  },
  watch: {
    value: {
      handler(notify) {
        if (notify.notify_user_list && notify.notify_user_list.length > 0) {
          this.empOptions.push(...notify.user_full_list)
        }
      },
      immediate: true
    }
  },
  methods: {
    valueChangeHanlde(value, prop) {
      this.$emit('input', {
        ...this.value,
        [prop]: value
      })
    },
    getSelectOptions(id) {
      let url = 'dictionary/listByDataAuth/' + id
      return new Promise((resolve, reject) => {
        this.$http.get(url).then(({ body }) => {
          let options = body.data.map(({ id: value, dName: text }) => {
            return {
              value,
              text
            };
          });
          switch (id) {
            case 1330:
              this.eventOptions = options
              break
            case 1300:
              this.seriousOptions = options
              break;
            case 1310:
              this.sourceOptions = options
              break
            case 1320:
              this.statusList = options
              break
            case 1550:
              this.labelIdsOptions = options
              break
          }
          resolve(body)
        })
      })
    },
    empSearchList(query) {
      if(query !== '') {
        this.$http.get('secEvent/searchEmpList', {params: {'account': query}}).then(res => {
          if (res.data.errno == 0) {
            this.empOptions = []
            this.empOptions = res.data.data.map((item) => {
              return {
                value: item.id,
                label: item.name + '(' + item.email+ ')'
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
  },
  created() {
    this.getSelectOptions(1330)
    this.getSelectOptions(1300)
    this.getSelectOptions(1310)
    this.getSelectOptions(1320)
    this.getSelectOptions(1550)
  },
}
</script>

<style lang="less">
  .notify-edit {
    .el-form-item {
      margin-bottom: 0;
    }
    .el-checkbox {
      margin-right: 30px;
      &+.el-checkbox {
        margin-left: 0
      }
    }
  }
</style>
