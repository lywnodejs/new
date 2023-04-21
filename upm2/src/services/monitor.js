import request from '../utils/request';

const getIndicatorsTotal  = () => {
  return request('/operation/getIndicatorsInTotal');
}

const getIndicatorsApp = (data) => {
  return request('/operation/getIndicatorsForApps', { params: data });
}

export default {
  getIndicatorsTotal,
  getIndicatorsApp
}