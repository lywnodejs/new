import request, { postJSON } from '../utils/request';

const getDimensionList = (appId) => {
  return request(`/v2/app/getdimebyappid?appId=${appId}`);
};

const addDimension = (params) => {
  return postJSON('/v2/dime/create', params);
};

const delDimension = (params) => {
  return postJSON('/v2/dime/delete', params);
};

const updateDimension = (params) => {
  return postJSON('/v2/dime/update', params);
};

const getDimensionDetail = (appId, id) => {
  return postJSON('/v2/dimenode/select/alldimenodestree', {
    appId,
    dimeId: id
  });
};

const addDimensionNode = (params) => {
  return postJSON('/v2/dimenode/insert/dimenode', params);
};

const updateDimensionNode = (params) => {
  return postJSON('/v2/dimenode/update/dimenode', params);
};

const delDimensionNode = (params) => {
  return postJSON('/v2/dimenode/delete/dimenode', params);
};

export default {
  getDimensionList,
  addDimension,
  updateDimension,
  delDimension,
  getDimensionDetail,
  addDimensionNode,
  updateDimensionNode,
  delDimensionNode
};
