//机器人配置平台的路由配置



import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

//一级路由
const login = () => import('@/pages/login');//登录
const myrobot = () => import('@/pages/robotConfigPages/myrobot')//我的机器人
const wordslotmanagement = () => import('@/pages/robotConfigPages/wordslotmanagement.vue');//词槽管理
const intentmanagement = () => import('@/pages/robotConfigPages/intentmanagement');//意图管理
const anwermanagement = () => import('@/pages/robotConfigPages/answerconfig');//答案设置
const skillhome = () => import('@/pages/robotConfigPages/skillhome');//技能首页
const task = () => import('@/pages/mytask');//我的任务(意图管理)
const homequestion = () => import('@/pages/robotConfigPages/homequestion');//机器人首页问题设置
const homequestioncategory = () => import('@/pages/robotConfigPages/homequestioncategory');//机器人首页问题类别设置
const datastatistics = () => import('@/pages/robotConfigPages/datastatistics');//数据统计


//技能设置相关页面 二级路由
const skillnavigation = () => import('@/pages/robotConfigPages/skillnavigation');//技能导航页
const tacticsmanagement = () => import('@/pages/robotConfigPages/tacticsmanagement');//策略设置
const skillmanagerment = () => import('@/pages/robotConfigPages/skillmanagerment');//技能设置页
const addtactics = () => import('@/pages/robotConfigPages/addtactics');//新建策略页面
const knowledgemanagement = () => import('@/pages/robotConfigPages/knowledgemanagement');//知识管理页面
const qamanagent = () => import('@/pages/robotConfigPages/qamanagent');//问答对管理页面
const addqapair = () => import('@/pages/robotConfigPages/addqapair');//新建和编辑问答对

// const rhlogin = () => import('../../node_modules/rh-login/src/packages/login/rhLogin')//登录模块




/*********************已下为意图管理相关(用的标注平台的页面)************************************/
//语料标注相关
const home = () => import('@/pages/home');//首页
const labelcategory = () => import('@/pages/ylbz/labelcategory');//标签类别管理
const labelmanage = () => import('@/pages/ylbz/labelmanage');//标签管理
const corpusmaintenance = () => import('@/pages/ylbz/corpusmaintenance');//语料样本集管理
const corpussearch = () => import('@/pages/ylbz/corpussearch');//语料搜索
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

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component:myrobot,
      name: '我的机器人one',
    },
    {
      path: '/login',
      component: login,
      name: '登录',
      query: { taskType: 'dialogue'}
    },{
      path: '/myrobot',
      component: myrobot,
      name: '我的机器人',
    },{
      path: '/wordslotmanagement',
      component: wordslotmanagement,
      name: '词槽管理'
    },{
      path: '/intentmanagement',
      component: intentmanagement,
      name: '意图管理'
    },{
      path: '/anwermanagement',
      component: anwermanagement,
      name: '答案设置'
    },{
      path: '/datastatistics',
      component: datastatistics,
      name: 'datastatistics'//数据统计模块
    },{
      path: '/skillhome',
      component: skillhome,
      name: '技能首页'

    },{
      path: '/homequestion',
      component: homequestion,
      name: '首页问题'

    },{
      path: '/homequestioncategory',
      component: homequestioncategory,
      name: '首页类别管理'

    },{
      path: '/skillnavigation',
      component: skillnavigation,
      name: '技能导航',
      children: [{
        path: '/tacticsmanagement',
        component: tacticsmanagement,
        name: '策略管理',
      },{
        path: '/skillmanagerment',
        component: skillmanagerment,
        name: '技能设置',
      },{
        path: '/addtactics',
        component: addtactics,
        name: '新建策略',
      },{
        path: '/knowledgemanagement',
        component: knowledgemanagement,
        name: '知识管理',
      },{
        path: '/qamanagent',
        component: qamanagent,
        name: '问答对管理',
      },{
        path: '/addqapair',
        component: addqapair,
        name: '新建编辑问答对',
      }]
    },

    //意图管理模块
    {
      path: '/mytask',
      component: task,
      name: '我的任务'
    },{
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
