<template>
  <div id="dorado-comments">
      <div class="title">留言区</div>
      <div class="comments" v-for="item in comments" :key="item.comment_id">
          <div class="header">
              <img :src="item.avatar_link" alt="" class="image">
              <span class="myName">{{item.comments_owner_zh}} 
                  <span v-show="item.reply_comments_owner!=''"><span class="iTag">回复</span> {{item.reply_comments_owner}}</span> 
              </span>
              <span class="time">{{item.create_time}}</span>
          </div>
          <div class="content">
              <pre>{{item.comments}}</pre>
          </div>
          <div class="recomment" @click="addReplyer(item.comments_owner_zh, item.comments_owner)">回复</div>
          <div class="cutline"></div>
      </div>
      <!-- <div>查看全部100条评论</div> -->
      <div class="footer">
          <el-input v-model="commentContext" placeholder="写下你的留言..." class="comment" ref="input" type="textarea" autosize>
          </el-input> 
          <div class="publish">
              <el-button @click="sendComment" :disabled='disabled' class="button">发布</el-button>
          </div>
      </div>
  </div>
</template>
<script>

import {connect} from '@/lib'

export default connect(() => {
    return {
    }
  }, {
      sendComments: 'dorado_project/sendComments',
      getComments: 'dorado_project/getComments'
  })({
  name: '',
  data() {
    return {
        sdl_project_id: parseInt(this.$route.query['projectId']),
        commentContext: '',
        comments: [],
        disabled: true,
        param: {
            sdl_project_id: this.sdl_project_id,
            reply_comments_owner: '',
            comments: this.commentContext
        }
    }
  },
  inject: ['getWorkFlow'],
  created() {
    this.fetchData()
  },
  watch: {
      commentContext(val) {
          if (val == '') {
            this.disabled = true
          } else {
              this.disabled = false
          }
      }
  },
  methods: {
    fetchData() {
      this.sdl_project_id = parseInt(this.$route.query['projectId'])
      let queryParam = {
        'sdl_project_id': this.sdl_project_id
      }
      this.getComments(queryParam).then(res => {
        this.comments = res.comments
      })
    },
    sendComment() {
        this.param.sdl_project_id = this.sdl_project_id
        this.param.comments = this.commentContext
        if (this.param.reply_comments_owner) {
            this.param.comments = this.commentContext.split(':')[1]
        }
        this.sendComments(this.param).then(res => {
            this.fetchData()
            this.commentContext = ''
            this.param.reply_comments_owner = ''
        })
    },
    addReplyer(en, cn) {
        this.param.reply_comments_owner = en
        this.commentContext = '回复 ' + cn + ': '
        this.$refs.input.focus();
    }
  }
})
</script>
<style lang='less'>
  #dorado-comments {
    margin-top: 40px;
    -webkit-font-smoothing: antialiased;
    // border: 1px solid rgba(26,26,26,0.2);
    border-radius: 3px;
    width: 100%;
    .title {
      color: #333333;
      font-size: 14px;
      display: inline-block;
      line-height: 28px;
    }
    .comments{
      font-family: -apple-system,BlinkMacSystemFont,Helvetica Neue,PingFang SC,Microsoft YaHei,Source Han Sans SC,Noto Sans CJK SC,WenQuanYi Micro Hei,sans-serif;
      .header{
          height: 24px;
          margin: 0 0 4px;
          margin-top: 10px;
          font-size: 15px;
          padding: 0 3px 0 1px;
        .image {
            border-radius:50%;
            width:24px;
            height:24px;
            float: left;
            // line-height: 24px;
        }
        .myName{
            font-size: 15px;
            font-weight: 500;
            margin-left: 10px;
            color: rgba(26,26,26, 0.8);
            display: inline-block;
            // background: red;
            float: left;
            line-height: 24px;
            .iTag{
                color: #909398;
                font-weight: normal;
            }
        }
        .time{
            color: #909398;
            font-size: 12.5px;
            float: right;
            line-height: 24px;
        }
      }
      .content{
          padding-left: 35px;
          color: rgba(26,26,26, 0.8);
        //   text-indent:34px;
          font-size: 14px;
          pre{
            white-space: pre-wrap;           /* css-3 */
            white-space: -moz-pre-wrap;      /* Mozilla, since 1999 */
            white-space: -pre-wrap;          /* Opera 4-6 */
            white-space: -o-pre-wrap;        /* Opera 7 */
            word-wrap: break-word;           /* Internet Explorer 5.5+ */
          }
      }
      .recomment{
          text-indent:34px;
          color: #8590a6;
          cursor: pointer;
          padding: 5px 0px;
      }
      .cutline{
          padding-top: 3px;
          border-top: 1px solid rgba(26,26,26,0.1);
          width: 97%;
          margin: 0 auto;
      }
    }
    .footer{
        // margin: 0 auto;
        // text-align: center;
        width: 97%;
        margin-top: 10px;
        .comment{
            display: inline-block;
            width: 600px;
        }
        .publish{
            display: inline-block;
            .button{
                cursor: pointer;
                // height: 32px;
                position: relative;
                text-align: center;
                line-height: 10px;
                color: #fc9153;
                border-color: #fedcba;
                background-color: #fff3e8;
            }
            .el-button.is-disabled, .el-button.is-disabled:hover, .el-button.is-disabled:focus {
                color: #c0c4cc;
                cursor: not-allowed;
                background-image: none;
                background-color: #fff;
                border-color: #e2e2e2;
            }
        }
    }
  }
</style>
