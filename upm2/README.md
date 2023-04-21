upm2.0前端项目

#### 开发流程
  1. 切换到 feature_dev 分支拉取代码，切换到自己的分支
  1. `npm run prerelease` 使用测试环境数据
  2. 绑定 upm-test.xiaojukeji.com 到 10.95.117.199
  3. 浏览器访问 http://localhost:8000/upm2-static/main
  5. `git push origin HEAD:refs/for/feature_dev` 会触发鲲鹏自动创建的 CR 单

#### 上线打包
  1. `npm run build`生成生产包（环境变量isProduction为true）
  2. 【重要】因为 scmpf 平台打包太慢并且经常失败，改为前端打包并上传，国内包需要通过执行 `npm run build`，美东包需要执行 `npm run buildoversea`，然后提交到 git 后上线。

#### 上线须知
  1.  国内版 http://scmpf.intra.xiaojukeji.com/index.php/home/index/all/42197
      上线odin节点为 upm2-static.upm.sec.sec.didi.com [upm2] ，部署集群不可选美东机房（us01-v(弹性云)）
  2.  海外版 http://scmpf.intra.xiaojukeji.com/index.php/home/index/all/42197
      上线odin节点为 upm2-static.upm.sec.sec.didi.com [upm2] ，部署集群只选择美东机房（us01-v(弹性云)）
  3.  【已废弃】（海外版 http://scmpf.intra.xiaojukeji.com/index.php/home/index/all/52714 ，
      上线odin节点为 upm-auth.sec.sec.normandy-br.didi.com [upm2-static], 部署完成后需补充部署 1 中的美东机房，
      _具体需不需要上线此版本请跟 RD 确认_
      另外在 scmpf 构建的时候，记得在构建参数栏增加 oversea 字段。非海外版构建时请去掉这个字段。）

#### 翻译流程
  1. 运行 `npm run i18n:search` 获取需要被翻译的 key
  2. 运行 `npm run i18n:toCsv` 将上一步生成的 JSON 文件转换为 CSV 文件
  3. 将 CSV 文件交给翻译人员翻译
  4. 将翻译后的文件放入对应语言文件夹下
  5. 运行 `npm run i18n:getResult` 将 CSV 文件转为目标语言（英语）的 JSON 文件

#### 其他
  1. 接口文档地址 http://10.95.96.232/index.html?url=http://10.95.96.232/swagger.json
  2. Icon项目地址：http://www.iconfont.cn/manage/index?manage_type=myprojects&projectId=539701
  3. 为了大数据需求，QA环境有专门的 ID 为 1182 名称为 滴滴数据平台测试系统 的子系统，
     在发布到测试环境时需要 `npm run qa` 来保证打包出来的 isProduction 环境变量不为 true

#### 部署测试环境

- 运行 `npm run qa` 或 `npm run qaoversea`
- 提交代码到 git 仓库
- 登录 10.179.84.172 服务器
- 10.179.84.172 root/111111
- 10.179.229.236 root/111111
- cd /home/xiaoju
- `vi deploy_upm2static.sh` 注意修改成自己的测试分支，保存退出
- `sh deploy_upm2static.sh`

```bash
# deploy_upm2static.sh
project_name=upm2-static
cd ROOT
rm -fr $project_name
git clone -b woater git@git.xiaojukeji.com:risk-sec/upm2.git $project_name
cd $project_name
rm -fr /home/xiaoju/$project_name
mkdir /home/xiaoju/$project_name
cp -fr dist/* /home/xiaoju/$project_name/
```
