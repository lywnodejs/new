<template>
  <div class="notify-detail">
    <el-form label-width="120px" label-suffix="：">
      <el-row>
        <el-col>
          <el-form-item :label="$t('manage.notify.name')">
            {{notify.name}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item :label="$t('manage.event_type')">
            <span class="notify-detail__name" v-for="type in notify.event_type" :key="type.id">
              {{ type.name }}
            </span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item :label="$t('manage.serious_level')">
            <span class="notify-detail__name" v-for="level in notify.event_level" :key="level.id">
              {{ level.name }}
            </span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item :label="$t('manage.event_status')">
            <span class="notify-detail__name" v-for="status in notify.event_status" :key="status.id">
              {{ status.name }}
            </span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item :label="$t('manage.notify.user')">
            <span class="notify-detail__name" v-for="user in notify.notify_user" :key="user.id">
              {{ user.name }}
            </span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item :label="$t('manage.notify.status')">
            {{ notify.status_name}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span=12>
          <el-form-item :label="$t('manage.notify.creator')">
            {{ notify.create_user_name}}
          </el-form-item>
        </el-col>
        <el-col :span=12>
          <el-form-item :label="$t('manage.notify.createTime')">
            {{ notify.create_time}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span=12>
          <el-form-item :label="$t('manage.notify.modifier')">
            {{ notify.update_user_name}}
          </el-form-item>
        </el-col>
        <el-col :span=12>
          <el-form-item :label="$t('manage.notify.modifyTime')">
            {{ notify.update_time}}
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    notify: {
      type: Object
    }
  }
}
</script>

<style lang="less">
  .notify-detail {
    .el-form-item {
      margin-bottom: 0;
    }
    &__name:not(:last-of-type) {
      &::after {
        content: '、'
      }
    }
  }
</style>
