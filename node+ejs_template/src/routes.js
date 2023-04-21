// var app = require('./app.js');
var controller = require('./controllers/index');
module.exports = function (app) {

  app.post('/api/web_top_pdf',controller.api.web_top_pdf);
  app.get('/index',controller.view.index);

  app.get('/',function (req,res) {
    res.send({code:0,message:"success"})
  });
};

