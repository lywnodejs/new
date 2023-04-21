import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

const home = () => import('@/pages/home');//首页
const login = () => import('@/pages/login');//登录
const task = () => import('@/pages/mytask');//我的任务
const help = () => import('@/pages/help');//帮助中心
//语料标注相关
const labelcategory = () => import('@/pages/ylbz/labelcategory');//标签类别管理
const labelmanage = () => import('@/pages/ylbz/labelmanage');//标签管理
const corpusmaintenance = () => import('@/pages/ylbz/corpusmaintenance');//语料样本集管理
const corpussearch = () => import('@/pages/ylbz/corpussearch');//语料搜索
const corpusimport = () => import('@/pages/ylbz/corpusimport');//语料导入
const corpustaging = () => import('@/pages/ylbz/corpustaging');// 语料标注
const corpustagings = () => import('@/pages/ylbz/corpustagings');//语料标注多条s

//模型训练相关
const trainsetting = () => import('@/pages/mxxl/trainsetting');//训练设置
const trainresult = () => import('@/pages/mxxl/trainresult');//训练结果
const verificationresult = () => import('@/pages/mxxl/verificationresult');//验证结果
const checkconfusion = () => import('@/pages/mxxl/checkconfusion');//查看混淆语料
const mxxlcorpustaging = () => import('@/pages/mxxl/corpustaging');//模型训练下的单条语料标注
const erroranalysis = () => import('@/pages/mxxl/erroranalysis');//错误分析修改
//模型测试相关
const testsetting = () => import('@/pages/mxsz/testsetting');//测试设置
const testresult = () => import('@/pages/mxsz/testresult');//测试设置

// 模型预测相关
const previewsetting = () => import('@/pages/mxyc/previewsetting');//预测设置
const previewresult = () => import('@/pages/mxyc/previewresult');//预测结果

// 模型管理相关
const modelmanage = () => import('@/pages/mxgl/modelmanage');//模型管理

//      redirect: '/labels',
export default new Router({
  routes: [{
    path: '/',
    component: login,
    name: '',
    hidden: true
  }, {
    path: '/login',
    component: login,
    name: '登录',
  }, {
    path: '/mytask',
    component: task,
    name: '我的任务',
  }, {
    path: '/help',
    component: help,
    name: '帮助中心'
  }, {
    path: '/home',
    name: '爬虫管理后台',
    component: home,
    children: [{
      path: '/labelcategory',
      component: labelcategory,
      name: '标签类别管理',
    },{
      path: '/labelmanage',
      component: labelmanage,
      name: '标签管理',
    }, {
      path: '/corpusmaintenance',
      component: corpusmaintenance,
      name: '语料样本集管理',
    }, {
      path: '/corpussearch',
      component: corpussearch,
      name: '语料搜索',
    }, {
      path: '/corpusimport',
      component: corpusimport,
      name: '语料导入',
      }, {
      path: '/corpustaging',
      component: corpustaging,
      name: '语料标注',
    }, {
      path: '/corpustagings',
      component: corpustagings,
      name: '语料标注多条',
    }, {
      path: '/trainsetting',
      component: trainsetting,
      name: '训练设置',
    }, {
      path: '/trainresult',
      component: trainresult,
      name: '训练结果',
    }, {
      path: '/verificationresult',
      component: verificationresult,
      name: '验证结果',
    }, {
      path: '/checkconfusion',
      component: checkconfusion,
      name: '查看混淆语料',
    }, {
      path: '/mxxlcorpustaging',
      component: mxxlcorpustaging,
      name: '模型训练下的单条语料标注',
    }, {
      path: '/erroranalysis',
      component: erroranalysis,
      name: '错误分析修改',
    }, {
      path: '/testsetting',
      component: testsetting,
      name: '测试设置',
    }, {
      path: '/testresult',
      component: testresult,
      name: '测试结果',
    }, {
      path: '/previewsetting',
      component: previewsetting,
      name: '预测设置',
    }, {
      path: '/previewresult',
      component: previewresult,
      name: '预测结果',
    }, {
      path: '/modelmanage',
      component: modelmanage,
      name: '模型管理',
    }]
  }
  ]
})
