<template>
    <div id="octopus">
        <div class="forward">服务介绍：
          <a href="http://wiki.intra.xiaojukeji.com/pages/viewpage.action?pageId=146620959" target="_blank">http://wiki.intra.xiaojukeji.com/pages/viewpage.action?pageId=146620959</a>
        </div>
        <div class="need">服务负责人：panxiting@didiglobal.com</div>
    </div>
</template>
<script>
import {connect} from '@/lib'

  export default connect(() => {
    return {
      user: 'user/user'
    }
  }, {
    signAgreementUserAuth: 'octopus_userauth/signAgreementUserAuth',
    getUserAuth: 'octopus_userauth/getUserAuth'
  })({
    data() {
        return {
            value: ''
        }
    },
    created() {
      this.getUserInfo()
    },
    methods: {
      getUserInfo() {
        let param = {username: this.user.username}
        this.getUserAuth(param).then(res => {
          if (res.data.user_agreement_status !== 'yes') {
            this.open()
          }
        })
      },
      confirm() {
        let param = {user_agreement_status: 'yes'}
        this.signAgreementUserAuth(param).then(res => {
          if (res.errno == 0) {

          }
          this.$notify({
              title: '成功',
              message: '已开通权限',
              type: 'success'
            })
        })
      },
      open() {
        let text = `<div>
          1.创建任务时扫描目标只能是自己负责的机器、WEB服务等，不可扫描他人的任何形式的IT资源。<br>
          2.因黑盒扫描任务对扫目标造成的任何不利影响、违规事件等责任均由扫描任务创建者自行承担。<br><br>
          如果不同意上述条款，将无法使用黑盒服务。
        </div>`
        this.$alert(text, '使用黑盒扫描服务前请遵守以下约定:  ', {
          confirmButtonText: '同意',
          dangerouslyUseHTMLString: true,
          showClose: false,
          callback: action => {
            this.confirm()
          }
        });
      }
    }
})
</script>
<style lang="less">
  #octopus {
        margin: auto;
        width: 100%;
        height: 100%;
        background: white;
        margin-top: -15px;
        box-sizing: border-box;
        .forward{
            padding-top: 30px;
            margin-top: 30px;
            text-align: center;
            font-size: 17px;
            margin: 0 auto;
        }
        .need{
            text-align: center;
            font-size: 15px;
            padding-top: 10px;
        }
    }
</style>

