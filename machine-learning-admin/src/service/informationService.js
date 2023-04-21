/**
 * Created by zhaobo on 18/07/25.
 */
import {getCookie} from '../utils/commonUtil';
/* eslint-disable */
class InformationService {
  constructor(clientAxios) {
    this.http = clientAxios
  }

  logSign(params) {
    let url = '/user/login';
    return this.http.postJson(url, params)
  }
  //机器人平台为支持航天云网的需求后续改为这个登录接口
  userLogin(params){
    let url = '/user/signin';
    return this.http.postJson(url, params)
  }

// 我的任务
//  保存任务
  savetask(params) {
    let url = '/task';
    return this.http.postJson(url, params)
  }

  //  根据条件查询任务
  querytask(params) {
    let url = '/task';
    return this.http.getJson(url, params)
  }

  //  根据编号删除任务
  deletetask(params) {
    let url = '/task';
    return this.http.deleteJson(url,params)
  }

  // 刷新弱分类模型(语料生效,语料发布)
  refreshClassification(params){
    let url = '/dialogue/manage/refresh/weak/classification';
    return this.http.getJson(url,params)
  }

  //标签类别管理 /label/type
  //  保存标签
  savelabelcategory(params) {
    let url = '/label/type';
    return this.http.postJson(url, params)
  }

  //  根据条件查询标签
  querylabelcategory(params) {
    let url = '/label/type';
    return this.http.getJson(url, params)
  }

  //  根据编号删除标签
  deletelabelcategory(params) {
    let url = '/label/type';
    return this.http.deleteJson(url,params)
  }


// 标签管理
//  获取标签分类/label/type
  labelClasses(params) {
    let url = '/label/type';
    return this.http.getJson(url, params)
  }

//  保存标签
  savelabel(params) {
    let url = '/labels';
    return this.http.postJson(url, params)
  }

  //  根据条件查询标签
  querylabel(params) {
    let url = '/labels';
    return this.http.getJson(url, params)
  }

  //  根据编号删除标签
  deletelabel(params) {
    let url = '/labels';
    return this.http.deleteJson(url,params)
  }
// 语料集
//  保存语料集
  savecorpus(params) {
    let url = '/corpus/dataset';
    return this.http.postJson(url, params)
  }

  //  GET /corpus/dataset
  // 根据条件查询
  querycorpus(params) {
    let url = '/corpus/dataset';
    return this.http.getJson(url, params)
  }

  //  DELETE /corpus/dataset
  // 根据编号删除
  deletecorpus(params) {
    let url = '/corpus/dataset';
    return this.http.deleteJson(url,params)
  }

//  语料查询
  //  GET /corpus/dataset
  // 根据条件查询
  corpusCheck(params) {
    let url = '/corpus';
    return this.http.getJson(url, params)
  }

  //导出语料
  corpusExport(params) {
    let url = '/corpus/export';
    return this.http.getJson(url, params)
  }

  // 保存单条语料
  Savecorpus(params) {
    let url = '/corpus';
    return this.http.postJson(url, params)
  }
  // 删除 单条语料
  Deletecorpu(params) {
    let url = '/corpus';
    return this.http.deleteJson(url, params)
  }
  //标注分布统计GET /corpus/group
  checkdistribute(params) {
    let url = '/corpus/group';
    return this.http.getJson(url, params)
  }
  //标注分布统计GET /corpus/group
  checkdistributePre(params) {
    let url = '/corpus/prediction/group';
    return this.http.getJson(url, params)
  }

  //预测语料结果查询
  corpusCheckprediction(params) {
    let url = '/corpus/prediction';
    return this.http.getJson(url, params)
  }
  //预测语料中标注/corpus/prediction/tagging

  corpusBiaozhuprediction(params) {
    let url = '/corpus/prediction/tagging';
    return this.http.postJson(url, params)
  }


  // 根据条件查询（混淆） GET /corpus/confusion 单标签以外
  corpusCheckconfusion(params,LabelTypeClass) {

    let url;
    if(LabelTypeClass==='LABEL_1'){
      url = '/corpus/label/confusion';
    }else {
      url = '/corpus/confusion';
    }
    return this.http.getJson(url, params)
  }
  // 人工标注语料（混淆）PUT /corpus/confusion/tagging
  corpusBiaozhuconfusion(params,LabelTypeClass) {
    let url;
    if(LabelTypeClass==='LABEL_1'){
      url = '/corpus/label/confusion/tagging';
    }else {
      url = '/corpus/confusion/tagging';
    }
    return this.http.postJson(url, params)
  }


  //corpus-source-search-controller 语料数据源的数据搜索
  getCorpusSource(params){
    let url = '/corpus/source/search';
    return this.http.getJson(url, params)
  }
  //根据条件导入数据集
  importCorpusSource(params){
    let url = '/corpus/source/search/import';
    return this.http.postJson(url, params)
  }


  // /corpus/tagging
  // 人工标注语料
  corpusBiaozhu(params) {
    let url = '/corpus/tagging';
    return this.http.postJson(url, params)
  }
//  /model/train
// 模型训练
  modelTrain(params) {
    let url = '/model/train';
    return this.http.postJson(url, params)
  }
  // 模型测试
  modelTest(params) {
    let url = '/model/test';
    return this.http.postJson(url, params)
  }
  // 模型预测POST /model/prediction
  modelPre(params) {
    let url = '/model/prediction';
    return this.http.postJson(url, params)
  }
//  模型训练/测试/预测
//  /model
// 根据条件查询
  getResultOne(params) {
    let url = '/model';
    return this.http.getJson(url, params)
  }
  //删除模型
  deleteModel(params) {
    let url = '/model';
    return this.http.deleteJson(url,params)
  }
//  model-train-result-controller : 模型结果训练/测试/验证
//  GET /model/result
// 根据条件查询
  getModelResult(params) {
    let url = '/model/result';
    return this.http.getJson(url, params)
  }
  ///model/group/labelType
  getModelLabels(params) {

    let url = '/model/group/labelType';
    return this.http.getJson(url, params)
  }

  // /corpus/confusion/group 分组统计（混淆预料排行列表）
  getconfusiongroup(params) {
    let url = '/corpus/confusion/group';
    return this.http.getJson(url, params)
  }

  /***机器人配置平台相关接口***/

  //获取机器人列表
  getRobotList(params){
    let url = '/task';
    return this.http.getJson(url, params)
  }

  //删除机器人
  deleRobot(params){
    let url = '/task';
    return this.http.deleteJson(url,params)
  }

  //新增机器人
  addRobot(params){
    let url = '/task';
    return this.http.postJson(url, params)
  }
  //编辑机器人
  editRobot(params){
    let url = '/task';
    return this.http.postJson(url, params)
  }

  //获取答案列表
  getAnswerList(params){
    let url = '/action';
    return this.http.getJson(url, params)
  }
  //删除答案请求
  deleAnswer(params){
    let url = '/action';
    return this.http.deleteJson(url, params)
  }
  // 检查答案是否被配置过
   checkAnswerList(params){
    let url = '/action/check';
    return this.http.getJson(url, params)
  }
  //新增答案提交请求
  addAnswer(params){
    let url = '/action';
    return this.http.postJson(url, params)
  }
  //编辑答案请求
  editAnswer(params){
    let url = '/action';
    return this.http.postJson(url, params)
  }
  //请求答案名称列表（数据中心和原有小e的答案）
  // answerNameList(params){
  //   let url = '/ai-platform/answer/edit';
  //   return this.http.getJson(url, params)
  // }
  //获取词槽列表  wxz更新词槽管理相关接口地址
  getWoldSoltList(params){
    let url = '/user/slot';
    return this.http.getJson(url, params)
  }
  //新增词槽请求
  addWoldSolt(params){
    let url = '/user/slot';
    return this.http.postJson(url, params)
  }
  //编辑词槽请求
  editWoldSolt(params){
    let url = '/user/slot';
    return this.http.postJson(url, params)
  }
  //删除词槽请求
  deleWoldSolt(params){
    let url = '/user/slot';
    return this.http.deleteJson(url, params)

  }
  //获取所有实体词槽类型  实体类型-entityType，实体属性-entityAttribute
  getEntitySlotTypeList(params){
    let url = '/user/slot/entityInfo';
    return this.http.getJson(url, params)
  }
  //词槽管理--选择词槽-----丛丛接口
  getDictList(params){
    let url = '/dict/type';
    return this.http.getJson(url, params)
  }
  //词槽管理--选择词槽-----丛丛接口
  getDictByword(params){
    let url = '/dict/type/word';
    return this.http.getJson(url, params)
  }
  //词槽值搜索接口--雨浓接口
  getSearchWordValue(parmas){
    let url = '/key/wizard/dialogue';
    return this.http.getJson(url,parmas)
  }
  //词槽管理--词槽信息-----小强接口
  getDictcolumn(params){
    let url = '/dictValue/table/column';
    return this.http.getJson(url, params)
  }

  //请求技能列表
  getSkillList(params){
    let url = '/skill';
    return this.http.getJson(url, params)
  }
  //新增技能
  addSkill(params){
    let url = '/skill';
    return this.http.postJson(url, params)
  }
  //编辑技能
  editSkill(params){
    let url = '/skill';
    return this.http.postJson(url, params)

  }
  //删除技能
  deleSkill(params){
    let url = '/skill';
    return this.http.deleteJson(url, params)
  }
  //请求策略列表
  getTacticsList(params){
    let url = '/qa/labels';
    return this.http.getJson(url, params)
  }
  ///qa/labels/{id}
  // 根据编号查询
  getByRulesId(params){
    let url = '/qa/labels/'+params.id;
    return this.http.getJson(url)
  }
  ///tree/search 搜索树节点
  getTree(params){
    let url = '/tree/search';
    return this.http.getJson(url, params)
  }
  ///dictValue/type 查询枚举值
  getDictValue(params){
    let url = '/dictValue/type';
    return this.http.getJson(url, params)
  }
  //新增策略
  addTactics(params){
    let url = '/qa/labels';
    return this.http.postJson(url, params)
  }
  //编辑策略
  editTactics(params){
    let url = '/qa/labels';
    return this.http.postJson(url, params)
  }
  //删除策略
  deleTactics(params){
    let url = '/qa/labels';
    return this.http.deleteJson(url, params)
  }
  //立即生效接口(刷对话缓存)
  dialogueCache(params){
    let url = '/dialogue/manage/refresh';
    return this.http.getJson(url, params)
  }
  //请求知识类别列表
  getKnowledgeList(params){
    let url = '/qaKnowledge/type';
    return this.http.getJson(url, params)
  }
  //删除知识类别
  deleKnowledge(params){
    let url = '/qaKnowledge/type';
    return this.http.deleteJson(url, params)
  }
  //新增和编辑知识类别
  addAndeditKnowledge(params){
    let url = '/qaKnowledge/type';
    return this.http.postJson(url, params)
  }
  //导出知识类别excel表文件
  exportKnowledgeExcel(params){
    let url = '/qaKnowledge/type/export';
    return this.http.getJson(url, params)
  }
  //问答对列表
  getQaKnowledgeList(params){
    let url = '/qaKnowledge';
    return this.http.getJson(url, params)
  }
  //删除问答对
  deleQaKnowledge(params){
    let url = '/qaKnowledge';
    return this.http.deleteJson(url, params)
  }
  //新增和编辑问答对
  addAndEditQaKnowledge(params){
    let url = '/qaKnowledge';
    return this.http.postJson(url, params)
  }
  //首页问题类别列表
  getQuestionCategoryList(params){
    let url = '/index/question/type';
    return this.http.getJson(url, params)
  }
  //新增首页问题类别
  addQuestionCategory(params){
    let url = '/index/question/type';
    return this.http.postJson(url, params)
  }
  //删除首页问题类别
  deleQuestionCategory(params){
    let url = '/index/question/type';
    return this.http.deleteJson(url, params)
  }
  //首页问题列表
  getHomeQuestionList(params){
    let url = '/index/question';
    return this.http.getJson(url, params)
  }
  //新增首页问题
  addHomeQuestion(params){
    let url = '/index/question';
    return this.http.postJson(url, params)
  }
  //删除首页问题
  deleHomeQuestion(params){
    let url = '/index/question';
    return this.http.deleteJson(url, params)
  }
  //获取机器人皮肤logo等配置
  getRobotConfigInfo(params){
    let url = '/robot';
    return this.http.getJson(url, params)
  }
  //设置机器人皮肤logo等配置
  setRobotConfigInfo(params){
    let url = '/robot';
    return this.http.postJson(url, params)
  }
  //请求模板答案列表
  getTemplateAnswerList(params){
    let url = '/config/report/search';
    return this.http.getJson(url, params)
  }

  //请求模板答案列表
  getNodeTemplateAnswerList(params){
    params.userName = getCookie('userName');
    let url = '/reportUrl/config/report/search';
    return this.http.getJson(url, params)
  }
  getModeParams (params){
    let url = '/previewReportUrl/report/params'
    params.userName = getCookie('userName');
    params.userId = getCookie('userId');
    return this.http.getJson(url, params)
  }
  //获取所有实体的属性标签(词槽)
  getSoltEntityAttribute(params){
    let url = '/slot/attribute';
    return this.http.getJson(url, params)
  }
  //数据统计接口
  getRobotStatistic(params){
    let url = '/statistics/stat/number';
    return this.http.getJson(url, params)
  }
  //获取答案和问题统计接口
  getStatisticsQA(params){
    let url = '/statistics/stat/group';
    return this.http.getJson(url, params)
  }
  //单标签混淆排行
  getLabelConfusionGroup(params) {
    let url = '/corpus/label/confusion/group';
    return this.http.getJson(url, params)
  }
  //模型管理：模型发布、撤销发布，publishStatus:0-待发布,1-已发布
  modelPublish(params) {
    let url = '/model/publish';
    return this.http.putJson(url, params)
  }
  //获取模型对比结果
  compareModelGroup(params) {
    let url = '/model/label/result';
    return this.http.getJson(url, params)
  }
  //获取模型类型
  getModelType(params) {
    let url = '/model/type';
    return this.http.getJson(url, params)
  }

//  模型分组类型
  getModelTypeGroup(params) {
    let url = '/model/type/group';
    return this.http.getJson(url, params)
  }

}

export default {
  InformationService
}
