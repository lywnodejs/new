# 使用说明

## Hbuilderx

- 已支持HBuilderX最新版

## 小程序安装步骤
- 先从私服上clone下来项目
- 下载uni的开发者工具 https://www.dcloud.io/hbuilderx.html
- 登录微信开发者工具打开 菜单 > 设置 > 安全设置  勾选服务端口为开启
- 当前项目下执行 npm install 
- 命令行进入项目所在的目录，点击 hbuilderx > 菜单 > 运行 > 运行到小程序模拟器 > 微信开发者工具
- uni会自动打开微信开发者工具并且打开uni的项目

## 注意事项
- uniapp v3.1版本已经兼容h5，另外yshop有自己的H5，uniappv3.1以下版本未对H5端进行处理，如果需要请自行兼容。
- manifest.json 中可以配置uni项目的一些信息
- 打开manifest.json可配置小程序的 appid
- 由于需要兼容app，公共样式由 main.js 迁移到了 App.vue，公共样式请在App.vue中进行编辑
- 项目基于uview-ui进行开发，舍弃colorui
- 系统主题文件在uview-ui/theme.scss


## 项目根目录
    |--unpackage // 构建包
	|--assets // 静态资源文件
	|--components // 平台自定义封装组件
	|--libs
	|--models // 数据管理层
	|--assets // 静态资源文件
	|--pages  // 页面
	|--utils  // 常用工具类文件
	|--vis  // 可视化配置文件
	|--App.vue
	|--main.js  // 程序入口文件
    |--static  // 无需编译第三方静态资源
    |--package.json
    |--pages.json // 项目页面配置



## TODO
- 目录结构后期维护下  添加说明
- 无用组件，文件逐渐删除
- 由于需要兼容app，尺寸单位由之前的rem改为rpx，由于修改样式工作量太大并且容易出错，已将.css更改为.less并在其中以之前rem的单位*100，获得新的rpx单位
- 如需修改样式问题，请编辑.less的文件，请勿编辑.css的文件