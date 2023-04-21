<template>
  <app-shield pos="top" :show="show" :enable-mask="true" @app:shield:close="handleClose">
    <div class="app-muuri-config">
      <div class="app-muuri-config__control">
        <el-row :gutter="15">
          <el-col :span="8">
            <el-dropdown
              placement="bottom-start"
              @command="handleAdd">
              <div class="app-muuri-config__control__add">
                Portal<i class="el-icon-arrow-down el-icon--right"></i>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="item in options"
                  :command="item"
                  :key="item.id"
                  :disabled="disabled(item.id)">
                  <span class="app-muuri-config__control__label" style="float: left">{{ item.name }}</span>
                  <i class="icon iconfont icon-plus1" style="float: right; color: #8492a6; font-size: 13px"></i>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </div>
      <app-muuri :default-items="portals" ref="appMuuri"></app-muuri>
    </div>
  </app-shield>
</template>

<script>
export default {
  name: 'app-muuri-config',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      portal: null,
      options: [{
        id: 'portal-overview',
        name: '总体概览',
        width: 2
      }, {
        id: 'portal-calendar',
        name: '值守情况',
        width: 2
      }, {
        id: 'portal-statistics',
        name: '告警统计',
        width: 2
      }],
      portals: [{
        id: 'portal-overview',
        width: 2
      }, {
        id: 'portal-calendar',
        width: 2
      }]
    }
  },
  computed: {
    disabled() {
      const portals = this.portals

      return function(value) {
        return _.find(portals, ['id', value]) !== undefined
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('muuri:config:close')
    },
    handleAdd(portal) {
      this.$refs.appMuuri.add({
        ...portal
      }, false)
    }
  }
}
</script>

<style lang="less">
  .app-muuri-config {
    width: 80%;
    padding: 15px;
    margin: 0 auto;
    background-color: #ffffff;
    &__control {
      margin-bottom: 15px;
      &__label {
        width: 10vw;
      }
    }
  }

</style>
