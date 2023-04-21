# vue-element

基于vue.js，使用element-ui的管理平台

## 目录说明

```
|--项目根目录
    |--dist // 构建包
    |--mock // 本地代理mock数据
    |--src
        |--assets // 静态资源文件
        |--commons // 定义通用变量方法
        |--components // 平台自定义封装组件
        |--errors  // 错误处理页面
        |--i18n  // 国际化配置文件
            |--messages
                |--language_en.json 英文配置文件
                |--language_zh.json 中文配置文件
        |--lib
        |--models // 数据管理层
        |--pages  // 页面
        |--plugin  // 平台插件
            |--ajax // 平台封装ajax请求
            |--directives  // 指令
            |--mixins  // 通用mixin
            |--array.js
            |--date.js
            |--event.js
            |--filters.js
            |--index.js  // 平台组件注册配置
        |--portals  // 页面dashboard挂件
        |--routes  // routes文件，根据pages目录自动生成
        |--services  // 数据接口
        |--store  // store
        |--utils  // 常用工具类文件
        |--vis  // 可视化配置文件
        |--App.vue  // 程序页面结构文件
        |--main.js  // 程序入口文件
    |--static  // 无需编译第三方静态资源
    |--style  // 通用样式文件
        |--animate  // 通用动画样式
        |--base  // 常用基础样式
        |--element  // element theme变量文件
        |--iconfont  // 平台图标样式，使用‘http://www.iconfont.cn/home/index’
        |--layout  // 平台架构布局样式文件
        |--theme  // 平台主题样式文件
        |--index.less  // 平台less配置文件
        |--variables.less  // 通过less变量声明文件
    |--template_conf // 使用 baymax g {模板名称} list -c {配置文件名}生成列表文件，例如：baymax g  soc-template list -c list.js
    |--.editorconfig // 代码样式统一格式文件
    |--commitlint.config.js  // npm 提交统一格式化文件
    |--custom.config.js  // 自定义webpack常用变量文件
    |--deploy.config.js  // 部署机器配置文件
    |--index.ejs  // 模板文件
    |--mock.config.js  // mock配置文件
    |--package.json
```

## 切换至公司镜像源

```
<!-- npm config set registry https://artifactory.intra.xiaojukeji.com/artifactory/api/npm/npm/ -->

npm config set registry http://npm.intra.xiaojukeji.com
```

## 安装依赖

```
npm install
```

## 开发

```
npm start
```

## 发布

```
npm run build


## 测试环境
ssh xiaoju@10.190.2.228  nsfocus123


