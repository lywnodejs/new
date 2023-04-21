import request, { postJSON } from '../utils/request';

const getAllBlackCitiesId = (params) => request('/v2/sensitiveArea/all', { params });
const getAllBlackCities = (params) => request('/v2/sensitiveArea', { params });
const getSuggestionCities = (params) => request('/v2/sensitiveArea/query', { params });
const addToBlacklist = (data) => postJSON('/v2/sensitiveArea/add', data);
const rmFromBlacklist = (data) => postJSON('/v2/sensitiveArea/delete', data);

export {
  getAllBlackCitiesId,
  getAllBlackCities,
  getSuggestionCities,
  addToBlacklist,
  rmFromBlacklist,
};
