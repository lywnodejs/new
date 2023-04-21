<template>
  <header class="header">
    <div>
      <a href="/project/portals/pages/index.html" class="logo">滴滴安全</a>
      <ul class="header-list">
          <li :class="{'hover' : item.active}" v-for="item in menus" :key="item.url + item.name">
            <a :href="item.urlName === 'application-list' ? item.url + '#?formType=0' :item.url">{{translateByName('global', item.name)}}</a>
            <i></i>
            <ul class="p-dropdown" v-if="item.menu && item.menu.length > 0">
                <li v-for="sub in item.menu" :key="sub.name"><a :href="sub.url">{{translateByName('global', sub.name)}}</a></li>
            </ul>
          </li>
      </ul>
      <div class="header-right">
          <div class="msg">
              <a class="msg-robot" target="_blank" href="http://e.xiaojukeji.com/robot/e48108d652a84a3eb16afb46b708c0c3">
                <img width="20" src="/project/portals/i/service.png">
                <span>信息安全小助手</span>
              </a>
              <a href="/project/portals/pages/task.html"><span>待办</span><b>{{taskFmt}}</b></a>
              <div class="lang">
                <img width="20px" src="@/assets/i18n.png" alt="">
                <ul class="p-dropdown">
                    <li @click="changeLocal(item.lang)" v-for="item in langs" :key="item.lang">
                      <a href="javascript:;">{{item.label}}</a>
                    </li>
                </ul>
              </div>
          </div>
          <div class="wrap-user-img">
              <div class="wrap-img">
                  <img :src="iconSrc">
              </div>
              <div class="user">
                  <span class="name">{{username}}</span>
                  <ul class="p-dropdown">
                      <li v-if="dutyEmp"><a href="/project/portals/pages/duty.html#/zhiban">值班管理</a></li>
                      <li v-if="dutyMgr"><a href="/project/portals/pages/duty.html#/paiban">排班管理</a></li>
                      <li><a href="/project/mis/sdl.html#/compliance/evaluation/common">安全评估项目</a></li>
                      <li><a href="/project/mis/sdl.html#/report/list">上报可疑事件</a></li>
                      <li @click="logout"><a href="javascript:">注销</a></li>
                  </ul>
              </div>
          </div>
      </div>
    </div>
  </header>

</template>

<script>
import { mapActions } from 'vuex'

export default {
    name: 'Header',

    data() {
        return {
            taskCount: 0,
            menus: [],
            username: '',
            roles: [],
            masterMenu: '',
            subMenu: null,
            name: '',
            activeItem: null,
            langs: [
              {
                label: '中文',
                lang: 'zh'
              },
              {
                label: 'English',
                lang: 'en'
              }
            ]
        }
    },

    computed: {
        iconSrc() {
            // const src = `http://home.didichuxing.com/DidiFile/Avatar/${this.name}.jpg`
            return 'http://static.galileo.xiaojukeji.com/static/tms/api/public/other/8355c3caf02679026151c10588307c5a.png'
        },

        taskFmt() {
            if (this.taskCount > 99) {
                return '99+'
            }
            return this.taskCount
        },

        dutyEmp() {
            return this.roles.indexOf('dutyEmp') > -1
        },

        dutyMgr() {
            return this.roles.indexOf('dutyMgr') > -1
        },

        currentMenu() {
            if (this.subMenu) {
                return this.masterMenu + this.subMenu
            }
            return this.masterMenu
        },

        routePath() {
            return this.$store.state.currPath
        }
    },

    watch: {

        //  改变位置
        routePath(val) {
            this.subMenu = '#' + val
            this.menus.forEach(item => {
                if (this.isCurrent(item)) {
                    item.active = true
                } else {
                    item.active = false
                }
            })
        }

    },

    created() {
        //  需要增强对单页面多一级菜单的容错性，增加多/#路由的判断
        let currentUrl = location.href,
            regex = /^https?:\/\/[^/]+(\/.+\.html)[^#]*(#\/[a-zA-Z0-9-/]*)?/,
            values = currentUrl.match(regex),
            masterMenu = values[1],
            subMenu = values[2]
        this.masterMenu = masterMenu
        this.subMenu = subMenu
    },

    mounted() {
        this.$http.get('sec/user').then(rsp => {
            const user = rsp.body.data
            //  预处理
            user.menus.forEach(item => {
                if (this.isCurrent(item)) {
                    item.active = true
                    this.activeItem = item
                } else {
                    item.active = false
                }
            })
            this.menus = user.menus
            this.username = user.userName
            this.name = user.name
            waterMark({
              systemId: '452',
              imgWidthDis: 100,
              imgHeightDis: 100,
              textStyle: 'rgba(0,0,0,0.08)',
              userId: user.name,
              containerEl: document.querySelector('.page-center')
            })
        })
        this.$http.get('process/getTaskCount').then(rsp => {
            this.taskCount = rsp.body.data
        })
        //  排班管理
        this.$http.get('userInfo').then(rsp => {
            let datas = rsp.body.roles,
                roles = []
            datas.forEach(item => {
                roles.push(item.name)
            })
            this.roles = roles
        })
    },

    methods: {
        ...mapActions([
          'changeLang'
        ]),
        changeLocal(lang) {
          this.$i18n.locale = lang
          this.changeLang(lang)
        },
        isCurrent(item) {
            // let equals = item.url.indexOf(this.masterMenu) > -1
            // if(this.subMenu) {
            //     equals = equals && item.url.indexOf(this.subMenu) > -1
            // }
            // return equals
            if (item.url == this.currentMenu) {
                return true
            }
            if (!item.menu) {
                return false
            }
            for (let i = 0, len = item.menu.length; i < len; i++) {
                if (item.menu[i].url == this.currentMenu) {
                    return true
                }
            }
            return false
        },

        logout() {
            this.$http.get('/logout').then(rsp => {
                const res = rsp.body
                if (String(res.errno) !== '0' || !res.data.logoutURL) {
                    return;
                }
                location.href = res.data.logoutURL;
            })
        }
    },
};
</script>
<style lang="less">
  .header-right {
    .msg {
      .lang {
        display: inline-block;
        margin-left: 15px;
        position: relative;
        &:hover {
          .p-dropdown {
            transform: translate(-50%) scaleY(1);
          }
        }
        .p-dropdown {
          width: 75px;
          display: block;
          position: absolute;
          width: 160px;
          top: 62px;
          left: 50%;
          transition: transform .25s cubic-bezier(0.18, 0.89, 0.32, 1.28), -webkit-transform .25s ease-in;
          transform-origin: center top;
          transform: translate(-50%) scaleY(0);
        }
      }
    }
  }
</style>
