var app = require('./app.js');
var controller = require('./controllers/index');
module.exports = function (app) {
    app.post('/api/log/save', controller.log.save);
    app.get('/api/log/marketPrediction', controller.log.marketPrediction);//市场预测数据
    app.get('/api/information/policy/search', controller.log.policySearch);
    app.get('/api/information/policy/home', controller.log.home);
    app.get('/api/information/policy/infinity', controller.log.infinity);
    
    app.get('/api/kg/search', controller.log.know);//知识图谱搜索结果接口
    app.get('/api/kg/client/search', controller.log.clientKnow);//知识图谱搜索结果接口(对外限制次数)
    app.get('/api/kg/type/search', controller.log.knowType);//知识图谱info接口

    //一键研报模版接口
    app.get('/api/template', controller.templateController.search);

    //数据中台接口
    app.post('/api/dataStation/template', controller.templateController.station);
    app.get('/api/dataStation/template', controller.templateController.station);
    //司法纠纷详情页
    app.get('/api/template/commonDetail',controller.templateController.getDetail);
    app.get('/',function (req,res,next) {
      res.send({code:0,message:"I am healthy"})
    });
};

