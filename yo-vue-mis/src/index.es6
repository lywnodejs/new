import Vue from 'vue'
import VueResource from 'vue-resource'
import 'styles/header.css'
import 'styles/commons.less'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import BootstrapVue from 'bootstrap-vue'
import Router from 'vue-router'

import template from './index.html'
import Header from './commons/header.vue'
import Footer from './commons/footer.vue'
import { ROUTES } from './router/index.es6'
import { i18n } from './services.es6'
import store from './vuex/Store.es6'

import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'

import { userLink, customTip } from './app/compliance/evaluation/detail/FnComponent.es6'
import translateMixin from './commons/mixins/translateMixin'
import alarmDetail from './app/alarm/alarmDetail.vue'
import eventDetail from './app/alarm/eventDetail.vue'
import sdlTable from './commons/sdlTable.vue'
import TreeView from "vue-json-tree-view"
import table from './components/table/index.vue'
import tableColumn from './components/tableColumn'
import department from './components/department/index.vue'
import employee from './components/employee/index.vue'

Vue.use(VueResource)
Vue.use(BootstrapVue)
Vue.use(Router)

// 引入element-UI message by huangxiaomei
Vue.use(ElementUI)
Vue.mixin(translateMixin)
Vue.component('userLink', userLink)
Vue.component('customTip', customTip)
Vue.component('eventDetail', eventDetail)
Vue.component('alarmDetail', alarmDetail)
Vue.component('sdlTable', sdlTable)
Vue.component('app-table', table)
Vue.component('app-table-column', tableColumn)
Vue.component('app-department', department)
Vue.component('app-employee', employee)

Vue.use(TreeView)

const router = new Router({
    routes: ROUTES
})

//  全局路由
router.afterEach((to, from) => {
    store.commit('routePath', to.path)
    //console.log(to, to.path)
})

// Vue.http.options.emulateJSON = true;
// Vue.http.options.emulateHTTP = true;
//
const AppRoot = Vue.extend({

    template,

    components: {
        Header,
        Footer
    }

})
Vue.http.options.root = '/'
//  处理全局错误
Vue.http.interceptors.push((request, next) => {
    next(response => {
        const datas = response.body,
            errno = datas.errno
        if (errno == 301 && datas.data && datas.data.logoutURL) {
            //  跳转到登陆页面
            const url = datas.data.logoutURL
            location.href = url
        }
    })
})
new AppRoot({

    http: {
        //root : '/',
    },

    i18n,

    router,

    store

}).$mount('#appRoot')
