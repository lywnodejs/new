/**
 * Created by lijian on 2018/8/17.
 */
import ClientAxios from '../../lib/clientAxios';
import EventService from '../eventService';
import QuotaService from '../quotaService';
import QuotaService_ from '../quotaService2';
import YysbService from '../yysbService';
import YysbServiceList from '../yysbService2';
import ShareServer from '../share';
import infoService from '../infoService';
import IndustryService from '../IndustryService';


// const host = process.env.HOST || '192.168.137.1';
// const port = process.env.PORT || 8080;

// var fixURL = "http://" + host + ":" + port;
var fixURL = "";
let proxy = {
    information:fixURL + '/auto/report',
    quota:'/quota',
    quota2:'/zq',
    yysb:'/yysb/info',
    yysb_list:'/yysb/list',
    share:'/share',
    infoID:'/infoID',
    Industry:'/industry',
};

let client = {
    information:new ClientAxios.ClientAxios(proxy.information),
    quota:new ClientAxios.ClientAxios(proxy.quota),
    quota2:new ClientAxios.ClientAxios(proxy.quota2),
    yysb:new ClientAxios.ClientAxios(proxy.yysb),
    yysb_list:new ClientAxios.ClientAxios(proxy.yysb_list),
    share:new ClientAxios.ClientAxios(proxy.share),
    info:new ClientAxios.ClientAxios(proxy.infoID),
    Industry:new ClientAxios.ClientAxios(proxy.Industry)
}

let eventClientService = new EventService.EventService(client.information);
let quotaClientService = new QuotaService.QuotaService(client.quota);
let quotaClientService_ = new QuotaService_.QuotaService_(client.quota2);
let yysbClientService = new YysbService.YysbService(client.yysb);
let yysbClientService2 = new YysbServiceList.YysbServiceList(client.yysb_list);
let shareClientService = new ShareServer.ShareServer(client.share);
let infoClientService = new infoService.infoService(client.info);
let IndustryClientService = new IndustryService.IndustryService(client.Industry);
export {
    eventClientService,
    quotaClientService,
    quotaClientService_,
    yysbClientService,
    yysbClientService2,
    shareClientService,
    infoClientService,
    IndustryClientService
}

