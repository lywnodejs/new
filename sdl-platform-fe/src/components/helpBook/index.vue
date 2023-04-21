<template>
  <div class="app-helpBook">
    <el-popover
      placement="bottom"
      width="300"
      trigger="click">
      <ul class="app-helpBook__container">
        <li class="app-helpBook__container__content" v-for="message in messages" :key="message.id">
          <div href="javascript:;">
            <div class="app-helpBook__container__content__logo">
              <i class="iconfont icon-unie740"></i>
            </div>
            <div class="app-message__container__content__body" @click="bounceUrl(message.url)">
              {{message.content}}
              <br/>
              <small>{{message.date}}</small>
            </div>
          </div>
        </li>
      </ul>
<!--      <div class="message-footer">-->
<!--        <el-button class="markBtn">全部标记为已读</el-button>-->
<!--        <el-button class="viewBtn">查看全部</el-button>-->
<!--      </div>-->
      <li slot="reference" class="header-nav__bar__oper">
        <a href="javascript:;" class="iconfont icon-helpBook"><span class="text">帮助</span></a>
        <!-- <a href="javascript:;" class="el-icon-bell"></a> -->

      </li>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: 'app-helpBook',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      messages: [{
        id: 1,
        content: 'SDL白皮书',
        date: '2019-08-01 10:00:00',
        url: '/sdl/doc/whitepaper'
      },
      {
        id: 2,
        content: '安全开发规范',
        date: '2019-08-30 10:00:00',
        url: '/standard/Java/'
      },
      {
        id: 4,
        content: '安全开发规范（外包版）',
        date: '2020-05-01 10:00:00',
        url: '/'
      },
      {
        id: 3,
        content: 'SDL平台用户手册',
        date: '2018-09-30 10:00:00',
        url: '/'
      }],
      alerts: []
    }
  },
  methods: {
    handleClose() {
      this.$emit('message:close')
    },
    bounceUrl(url) {
        window.open(url)
    }
  }
}
</script>

<style lang="less">
  .app-helpBook {
    // height: 700px;
    // width: 300px;
    // background-color: rgba(0, 0, 0, 0.12);
    &__container {
      margin: 10px;
      &__content {
        font-size: 12px;
        color: #333333;
        padding-bottom: 7px;
        padding-top: 7px;
        cursor: pointer;
        -webkit-font-smoothing: antialiased;
        &__logo {
          text-align: center;
          float: left;
          i {
            font-size: 22px;
          }
        }
        &__body {
          // color: #909399;
          overflow: hidden;
          // padding: 0 15px;
          small {
            display: block;
            margin-top: 2px;
            color: #999999;
          }
        }
      }
    }
  }
  .app-helpBook.header-nav__bar__oper {
    padding: 0;
    margin-top: 0;
    margin-right: -10px;
  }
  .message-footer {
    background: #F3F7FA;
    .markBtn {
      background: none;
      border: none;
      font-size: 12px;
      padding: 15px 15px;
    }
    .viewBtn {
      float: right;
      background: none;
      border: none;
      color: #FC9153;
      font-size: 12px;
      padding: 15px 15px;
    }

  }
</style>
