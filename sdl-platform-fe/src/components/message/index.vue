<template>
  <!-- <app-shield :show="show" :top="65" @app:shield:close="handleClose">
    <div class="app-message">
      <el-tabs type="border-card">
        <el-tab-pane label="公告">
          <ul class="app-message__container">
            <li class="app-message__container__content" v-for="message in messages" :key="message.id">
              <div href="javascript:;">
                <div class="app-message__container__content__logo">
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
        </el-tab-pane>
        <el-tab-pane label="消息">
          <ul class="app-message__container">
            <li class="app-message__container__content" v-for="alert in alerts" :key="alert.id">
              <div href="javascript:;">
                <div class="app-message__container__content__logo">
                  <i class="iconfont icon-unie709"></i>
                </div>
                <div class="app-message__container__content__body">
                  {{alert.content}}
                  <br/>
                  <small>{{alert.date}}</small>
                </div>
              </div>
            </li>
          </ul>
        </el-tab-pane>
      </el-tabs>
    </div>
  </app-shield> -->
  <div class="app-message">
    <el-popover
      placement="bottom"
      width="300"
      trigger="click">
      <ul class="app-message__container">
        <li class="app-message__container__content" v-for="message in messages" :key="message.id">
          <div href="javascript:;">
            <div class="app-message__container__content__logo">
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
        <a href="javascript:;" class="iconfont icon-message"><span class="text">消息</span></a>
        <!-- <a href="javascript:;" class="el-icon-bell"></a> -->

      </li>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: 'app-message',
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
        content: '暂无消息',
        date: '',
        url: ''
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
  .app-message {
    // height: 700px;
    // width: 300px;
    // background-color: rgba(0, 0, 0, 0.12);
    &__container {
      margin: 15px;
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
  .app-message.header-nav__bar__oper {
    padding: 0;
    margin-top: 0;
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
  // .iconfont.icon-message{
  //   font-size: 17px;
  //   color: white !important;
  //   opacity: 0.7;
  // }
  // .iconfont:hover{
  //   opacity: 1;
  // }
</style>
