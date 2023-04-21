/**
 * Created by lijian on 2018/8/17.
 */
import ClientAxios from '../lib/clientAxios';
import EventService from './eventService';
import TestService from './test';
import LoginService from './loginService';

let proxy = {
    information:'/information',
    test:'/nodeGenerator',
    log:'/login'
};

let client = {
    information:new ClientAxios.ClientAxios(proxy.information),
    test:new ClientAxios.ClientAxios(proxy.test),
    log:new ClientAxios.ClientAxios(proxy.log),
}

let eventService = new EventService.EventService(client.information);
let nodeService = new TestService.TestService(client.test);
let loginService = new LoginService.LoginService(client.log);
export {
    eventService,
    nodeService,
    loginService
}

