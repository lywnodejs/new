/**
 * Created by lijian on 2018/8/17.
 */
import ClientAxios from '../lib/clientAxios';
import EventService from './eventService';
import infoEventService from './infoevent';
import getStockNameService from './getStockNameService';
import FreeQuestionService from './freeQuestionService';
import SearchStockService from './searchStockService';
let proxy = {
    information:'/information',
    infoevent:'/event',
    getStockName:'/getStockName',
    freeQuestion:'/freeQuestion',
  searchStock:'/searchStock'
};

let client = {
    information:new ClientAxios.ClientAxios(proxy.information),
    infoevent:new ClientAxios.ClientAxios(proxy.infoevent),
    getStockName:new ClientAxios.ClientAxios(proxy.getStockName),
    freeQuestion:new ClientAxios.ClientAxios(proxy.freeQuestion),
  searchStock:new ClientAxios.ClientAxios(proxy.searchStock),
}

let eventService = new EventService.EventService(client.information);
let infoevent = new infoEventService.infoEventService(client.infoevent);
let getStockName = new getStockNameService.getStockNameService(client.getStockName);
let freeQuestionService = new FreeQuestionService.freeQuestionService(client.freeQuestion);
let searchStock = new SearchStockService.SearchStockService(client.searchStock);
export {
    eventService,
    infoevent,
    getStockName,
    freeQuestionService,
  searchStock
}

