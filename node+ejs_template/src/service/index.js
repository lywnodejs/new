import ClientAxios from '../libs/clientAxios';
import config from'../config/index';

import ApiService from "./apiService";

// console.log(config[process.env.NODE_ENV])

let client = {
  apiService:new ClientAxios.ClientAxios(config[process.env.NODE_ENV].web_url),
}

let apiService = new ApiService.ApiService(client.apiService);

export {
  apiService
}

