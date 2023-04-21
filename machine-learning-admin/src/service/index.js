import ClientAxios from '../lib/clientAxios'


import InformationService from './informationService'


let informationClient = new ClientAxios.ClientAxios('/information');
let informationService = new InformationService.InformationService(informationClient);

let robotConfigClient =  new ClientAxios.ClientAxios('/robotConfig');
let robotConfigService = new InformationService.InformationService(robotConfigClient);

let robotcacheClient =  new ClientAxios.ClientAxios('/robotcache');
let robotcacheService = new InformationService.InformationService(robotcacheClient);

let semanticApiClient =  new ClientAxios.ClientAxios('/semanticApi');
let semanticApiService = new InformationService.InformationService(semanticApiClient);


let nodeClient =  new ClientAxios.ClientAxios('');
let nodeService = new InformationService.InformationService(nodeClient);

export {
  informationService,robotConfigService,robotcacheService,semanticApiService,nodeService
}

//crawler
