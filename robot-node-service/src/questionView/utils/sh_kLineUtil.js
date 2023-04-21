var sh_kLineUtil = {
  sn:0,
  paramByType: {
    num:52,//K线数据条数，当接口有数据返回时，则使用接口返回的数据，当接口没有数据返回时则使用52
    pressurePriceLine: 0,//压力位
    supportPriceLine:0,//支撑位
    pressurePrice:0,
    supportPrice:0,
    html:''
  },

  returnData:{
    ohlc:[],
    volume:[],
    l1:[],
    l2:[]
  },
  /**
   * 将K线数据映射成坐标系中的点
   * 获得支撑线和压力线与y轴的交点坐标，添加到支撑线/压力线数组中
   * @paramByType str
   * @returns {number}
   */
  mapDataByType:function (ohlc,volume,l1,l2,chart_t){
    var _list=[];//将数据映射成坐标系中的点
    for(var j = 0;j<ohlc.length;j++){
      _list.push([
        j,
        ohlc[j][0]
      ]);
    }
    /**
     * 将切线数据装换成坐标系中的点
     * @type {Array}
     */

    /**
     * 两条切线方程
     * (b1-d1)x+(c1-a1)y = b1c1-a1d1     (max,pre)
     * (b2-d2)x+(c2-a2)y = b2c2-a2d2     (min,sup)
     * 一共有53条数据，最后一天映射坐标系中的点（52，y）
     * 当x=52时，求y
     *
     */

    var data1 = [];
    var data2 = [];

    var lastTime = ohlc[ohlc.length-1][0];

    if(l1.length>0){
      for(var i = 0;i<l1.length;i++){
        for(var j = 0;j<_list.length;j++){
          if(l1[i][0] == _list[j][1]){
            var temp = [];
            temp.push(_list[j][0],l1[i][1]);
            data1.push(temp);
          }
        }
      }
      var a_1 = Number(data1[0][0]),
        b_1 = Number(data1[0][1]),
        c_1 = Number(data1[1][0]),
        d_1 = Number(data1[1][1]),


        y1 = 0;
      /*//交点公式
       x=[(b_1*c_1-a_1*d_1)*(c_2-a_2)-(c_1-a_1)*(b_2*c_2-a_2*d_2)]/[(b_1-d_1)*(c_2-a_2)-(c_1-a_1)*(b_2-d_2)];
       y=[(b_2*c_2-a_2*d_2)*(b_1-d_1)-(b_2-d_2)*(b_1*c_1-a_1*d_1)]/[(b_1-d_1)*(c_2-a_2)-(c_1-a_1)*(b_2-d_2)];*/


      //y1 = [(b_1*c_1-a_1*d_1)-52*(b_1-d_1)]/(c_1-a_1);
      y1 = [(b_1*c_1-a_1*d_1)-parseInt(ohlc.length)*(b_1-d_1)]/(c_1-a_1);
      l1.push([lastTime,Number(y1.toFixed(2))]);
    }

    if(l2.length>0){
      for(var i = 0;i<l2.length;i++){
        for(var j = 0;j<_list.length;j++){
          if(l2[i][0] == _list[j][1]){
            var temp = [];
            temp.push(_list[j][0],l2[i][1]);
            data2.push(temp);
          }
        }
      }
      if(data2.length == 0){
        data2.push(_list[0][0],l2[0][1]);
        data2.push(_list[1][0],l2[0][1]);
      }

      var a_2 = 0
      var b_2 = 0
      var c_2 = 0
      var d_2 = 0
      if(data2.length > 1){
        a_2 = Number(data2[0][0])
        b_2 = Number(data2[0][1])
        c_2 = Number(data2[1][0])
        d_2 = Number(data2[1][1])
      }


      var y2=0;
      //y2 = [(b_2*c_2-a_2*d_2)-52*(b_2-d_2)]/(c_2-a_2);
      y2 = [(b_2*c_2-a_2*d_2)-parseInt(sh_kLineUtil.paramByType.num)*(b_2-d_2)]/(c_2-a_2);

      l2.push([lastTime,Number(y2.toFixed(2))]);
    }


    var chartData = {
      num:sh_kLineUtil.paramByType.num,//K线数据条数，当接口有数据返回时，则使用接口返回的数据，当接口没有数据返回时则使用52
      pressurePriceLine: sh_kLineUtil.paramByType.pressurePriceLine,//压力位
      supportPriceLine:sh_kLineUtil.paramByType.supportPriceLine,//支撑位
      pressurePrice:sh_kLineUtil.paramByType.pressurePrice,
      supportPrice:sh_kLineUtil.paramByType.supportPrice,
      ohlc:ohlc,
      volume:volume,
      l1:l1,l2:l2,
      chart_t:chart_t
    }
    return chartData;
  },

}

export default sh_kLineUtil;

