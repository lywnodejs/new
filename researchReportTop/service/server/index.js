/**
 * Created by lijian on 2018/8/17.
 */
import ClientAxios from '../../lib/clientAxios';
import EventService from '../eventService';
import QuotaService from '../quotaService';


let proxy = {
    information:'http://semantic-api-service:31001',
    quota:'https://robot.rxhui.com//hangqing-service',
};

let client = {
    information:new ClientAxios.ClientAxios(proxy.information),
    quota:new ClientAxios.ClientAxios(proxy.quota)
}

let eventServerService = new EventService.EventService(client.information);
let quotaServerService = new QuotaService.QuotaService(client.quota);
export {
    eventServerService,
    quotaServerService
}

