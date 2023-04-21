/**
 * Created by lijian on 2018/4/19.
 */
import ClientAxios from '../lib/clientAxios';
import config from '../config/config'

import SearchService from '../service/searchService';
import UserService from '../service/userService';
import EntityService from '../service/entityService';
import MaintainHotServeice from '../service/maintainHotServeice';
import StructrudService from '../service/structrudService';
import EntityAddService from '../service/entityAddService';
import SpriteKeyService from '../service/spriteKeyService';

let knowledgeMap=config.knowledgeMap;
let HotClientMap=config.HotClientMap;
let userDataMap=config.userDataMap;
let structrudMap=config.structrudMap;
let entityAddMap=config.entityAddMap;
let spriteAddMap=config.spriteAddMap;

let knowledgeMapClient = new ClientAxios.ClientAxios(knowledgeMap);
let HotClient = new ClientAxios.ClientAxios(HotClientMap);
let UserDataClient = new ClientAxios.ClientAxios(userDataMap);
let StructrudaClient = new ClientAxios.ClientAxios(structrudMap);
let entityAddClient = new ClientAxios.ClientAxios(entityAddMap);
let spriteKeyClient = new ClientAxios.ClientAxios(spriteAddMap);

let searchService = new SearchService.SearchService(knowledgeMapClient);
let userService = new UserService.UserService(UserDataClient);
let entityService = new EntityService.EntityService(knowledgeMapClient);
let maintainHotServeice = new MaintainHotServeice.maintainHotServeice(HotClient);
let structrudService = new StructrudService.structrudService(StructrudaClient);
let entityAddService = new EntityAddService.entityAddService(entityAddClient);
let spriteKeyService = new SpriteKeyService.spriteKeyService(spriteKeyClient);

export {
  searchService,
  userService,
  entityService,
  maintainHotServeice,
  structrudService,
  entityAddService,
  spriteKeyService
}
