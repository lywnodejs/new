/**
 * Created by BoBo on 2017-07-19.
 */


//审核状态
const EVENT = {
  //文章类型
  eventType:[
    {id:'2',name:'经济'},
    {id:'3',name:'金融'},
    {id:'4',name:'科技'},
    {id:'5',name:'国际'},
    {id:'6',name:'企业'}
  ],
  statusType:{
    "0":'未发布',
    "1":'已发布'
  },
  //来源限制最多字符数
  mediaFromMaxLength:'8'

};


export {
  EVENT
}
