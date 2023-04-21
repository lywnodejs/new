<!--
 * @Date: 2020-08-02 18:18:18
 * @Author: 刘亚伟
 * @LastEditTime: 2020-08-04 22:20:01
-->
# **babel**

## babel-cli
`
 babel es6.js --out-file index.js //转码结果输出到另一个文件（ --out-file 或者  -o）
`
`
 babel src -out-dir dist //转码整个目录（ --out-dir 后者 -d）
`

## .babelrc 配置文件
 此文件用来设置转码规则和插件
`
{
    "presets":[],
    "plugins":[]
}
`
### presets字段用来设定转码规则，官方提供到规则如下
`npm i -s babel-preset-latest` //最新转码规则

### 不同阶段语法提案到转码规则（4个）
    presets预设编译规则(预设的编译插件集合)可以设置stage-0 至 stage-3， stage-0包含了stage-1 至 stage-3，也就是说如果设置为stage-0，stage-1 至 stage-3的编译功能默认都有了,
`npm i -s babel-preset-stage-0`
         `babel-preset-stage-1`
         `babel-preset-stage-2`
         `babel-preset-stage-3`
         
### 对应es语法提案的批准流程
 0：展示阶段
 1：征求意见阶段
 2：草案阶段
 3：候选阶段
 4：定案阶段
 

