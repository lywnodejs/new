var format = require('./format');
var utils = require("./com-util");
//资产负债表
var ashareBalanceSheet= [
  {
    name:"单位：百万元",
    value:"endDate",
    headerType:1 //标题样式
  },
  {
    name:"流动资产",
    value:"totCurAssets"
  },
  {
    name:"现金",
    value:"monetaryCap"
  },
  // {
  //   name:"交易性投资",
  //   value:"tradableFinAssets"
  // },
  {
    name:"应收票据",
    value:"notesRcv"
  },
  {
    name:"应收款项",
    value:"acctRcv"
  },
  {
    name:"其它应收款",
    value:"othRcv"
  },
  {
    name:"存货",
    value:"inventories"
  },
  
  {
    name:"非流动资产",
    value:"totCurAssets"
  },
  {
    name:"长期股权投资",
    value:"longTermEqyInvest"
  },{
    name:"固定资产",
    value:"fixAssets"
  },
  {
    name:"无形资产",
    value:"intangAssets"
  },
  
  {
    name:"资产总计",
    value:"totAssets"
  },
  {
    name:"流动负债",
    value:"totCurLiab"
  },
  
  {
    name:"应付账款",
    value:"acctPayable"
  },
  {
    name:"预收账款",
    value:"advFromCust"
  },
  
  {
    name:"长期负债",
    value:"totNonCurLiab"
  },
  {
    name:"长期借款",
    value:"ltBorrow"
  },
  
  {
    name:"负债合计",
    value:"totLiab"
  },
  {
    name:"股本",
    value:"capStk"
  },
  {
    name:"资本公积金",
    value:"capRsrv"
  },
  {
    name:"少数股东权益",
    value:"minorityInt"
  },
  {
    name:"归属母公司所有者权益",
    value:"totShrhldrEqyExclMinInt"
  },
  {
    name:"负债及权益合计",
    value:"totLiabShrhldrEqy"
  },
];
//单季度
var comFinaceIndicatorQ = [
  {
    name:"单位：百万元",
    value:"endDate", 
    headerType:2 //标题样式
  },
  {
    name:"一、营业总收",
    value:"totOperRev"
  },
  {
    name:"二、营业总成",
    value:"totOperCost"
  },
  {
    name:"其中：营业成本",
    value:"lessOperCost"
  },
  {
    name:"营业税金及附加",
    value:"lessTaxesSurchargesOps"
  },
  {
    name:"营业费用",
    value:"lessSellingDistExp"
  },
  {
    name:"管理费用",
    value:"managementCost"
  },
  {
    name:"研发费用",
    value:"rdExpense"
  },
  {
    name:"财务费用",
    value:"lessFinExp"
  },
  {
    name:"资产减值损失",
    value:"lessImpairLossAssets"
  },
  {
    name:"三、其他经营收益",
    value:""
  },
  // {
  //   name:"公允价值变动",
  //   value:"plusNetGainChgFv"
  // },
  {
    name:"其他收益",
    value:"otherIncome"
  },
  {
    name:"资产处置收益",
    value:"assetDisposalIncome"
  },
  {
    name:"四、营业利润",
    value:""
  },
  {
    name:"营业外收入",
    value:"plusNonOperRev"
  },
  {
    name:"营业外支出",
    value:"lessNonOperExp"
  },
  {
    name:"五、利润总额",
    value:"totProfit"
  },
  {
    name:"减：所得税",
    value:"incTax"
  },
  {
    name:"六、净利润",
    value:"netProfitInclMinIntInc"
  },
  {
    name:"减：少数股东损益",
    value:"minorityIntInc"
  },
  // {
  //   name:"归属母公司所有者权益",
  //   value:"" //totShrhldrEqyExclMinInt
  // },
  // {
  //   name:"EPS",
  //   value:"" //sQfaEps
  // },
  {
    name:"主要比率",
    value:""
  },
  {
    name:"毛利率",
    value:"sQfaGrossprofitmargin",
    datatype:'percent'
  },
  {
    name:"营业费率",
    value:"sQfaSaleexpensetogr",
    datatype:'percent'
  },
  
  {
    name:"营业利润率",
    value:"sQfaOptogr",
    datatype:'percent'
  },
  // {
  //   name:"净利率",
  //   value:"sQfaNetprofitmargin",
  //   datatype:'percent'
  // },
  {
    name:"YOY",
    value:""
  },
  {
    name:"收入增长率",
    value:"sQfaYoysales",
    datatype:'percent'
  },
  // {
  //   name:"营业利润增长率",
  //   value:"sQfaYoygr",
  //   datatype:'percent'
  // },
  {
    name:"净利润增长率",
    value:"sQfaYoynetprofit",
    datatype:'percent'
  },
];
//利润
var ashareIncome = [
  {
    name:"单位：百万元",
    value:"endDate",
    headerType:1 //标题样式
  },
  // {
  //   name:"营业成本",
  //   value:"totOperCost"
  // },
  {
    name:"营业收入",
    value:"operRev",
  },
  // {
  //   name:"营业现金及附加",
  //   value:"lesstaxessurchargesOps"
  // },
  // {
  //   name:"营业费用",
  //   value:"lesssellingdistExp"
  // },
  {
    name:"财务费用",
    value:"lessFinExp"
  },
  {
    name:"资产减值损失",
    value:"lessImpairLossAssets"
  },
  // {
  //   name:"公允价值变动收益",
  //   value:"plusNetGainChgFv"
  // },
  {
    name:"投资收益",
    value:"plusNetInvestInc"
  },
  {
    name:"营业利润",
    value:"operProfit"
  },
  {
    name:"营业外收入",
    value:"plusNonOperRev"
  },
  {
    name:"营业外支出",
    value:"lessNonOperExp"
  },
  {
    name:"利润总额",
    value:"totProfit"
  },
  {
    name:"所得税",
    value:"incTax"
  },
  
  {
    name:"净利润",
    value:"netProfitInclMinIntInc"
  },
  {
    name:"少数股东损益",
    value:"minorityIntInc"
  },
  {
    name:"归属于母公司净利润",
    value:"netProfitExclMinIntInc"
  },
  // {
  //   name:"EPS（元）",
  //   value:"sFaEpsBasic"
  // },
];
//现金流
var asharecashflow = [
  {
    name:"单位：百万元",
    value:"endDate",
    headerType:1 //标题样式
  },
  {
    name:"经营活动现金流",
    value:"netCashFlowsOperAct"
  },
  // {
  //   name:"净利润",
  //   value:"netProfit"
  // },
  //  {
  //   name:"财务费用",
  //   value:"finExp"
  // },
  {
    name:"投资损失",
    value:"investLoss"
  },
  {
    name:"投资活动现金流",
    value:"netCashFlowsInvAct"
  },
  {
    name:"筹资活动现金流",
    value:"netCashFlowsFncAct"
  },
  // {
  //   name:"现金净增加额",
  //   value:"speBalNetcashInc"
  // },
];
function headerItemFormat(type,header) {
  header = String(header)
  if(type ==1){
    if(header.length == 8){
      header = header.substr(0,4);
      return header;
    }
  }else if(type ==2){
    if(header.length ==8){
      var year = header.substr(2,2);
      var month = Number(header.substr(4,2))
      var season ="Q1";
      if(month  >3 && month < 7){
        season ="Q2";
      } else if(month  > 6 && month < 10){
        season ="Q3";
      }else if(month  > 9 && month < 13){
        season ="Q4";
      }
      return year +season;
    }
  }
  return header;
}
module.exports={
  getDataRuleByType:function (type) {
    if(type == "ashareBalanceSheet"){
      return ashareBalanceSheet;
    } else  if(type == "ashareIncome" ){
      return ashareIncome;
    } else  if(type == "comFinaceIndicatorQ" ){
      return comFinaceIndicatorQ;
    } else  if(type == "asharecashflow" ){
      return asharecashflow;
    }
  },
  generateDataByRule(list,dataRule){
    var tableData = [];
    for (var i =0;i < dataRule.length; i++){
      var rule = dataRule[i];
      var tr = [];
      tr.push(rule.name);
     
      var dataKey = rule.value;
      var dataType = rule.datatype;
      for (var j=0;j < list.length; j++){
        var tdValue = list[j][dataKey];
        var isE = list[j].isE;
        if(utils.stringIsEmpty(dataKey) || (i>0 &&isE)){
          tdValue=""
        } else {
          if(i > 0){
            if(utils.stringIsNotEmpty(tdValue)){
              if(dataType == 'percent'){
                tdValue =tdValue.toFixed(2)+"%"
              } else {
                tdValue = format.formatBaiWan(tdValue,2)
              }
            }else {
              tdValue = 0;
            }
          } else {
            tdValue = headerItemFormat(rule.headerType,tdValue);
          }
        }
        tr.push(tdValue);
      }
      tableData.push(tr);
    }
    return tableData;
  },
  getUsedFinancia(name){
    var str = "每股收益(元),每股净资产(元),每股公积金(元),每股未分配利润(元),每股经营现金流(元),毛利率(%),净利率(%),ROE-加权(%),ROIC(%),偿债能力(分),资产负债率(%),流动比率(%),速动比率(%),流动资产周转率(次),固定资产周转率(次),应收账款周转率(次),成长能力(分),PE-TTM,PB,PS-TTM"
    return (str.indexOf(name) == -1)?false:true;
  }
}