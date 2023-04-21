import _ from 'lodash';
import { isDevelopment } from '../config/env';
import { apiHost } from '../config/apiConfig';

const fixUriPrefix = (uri) => {
  // for mock test
  // if (/^(http|https)/.test(uri)) {
  //   return uri;
  // }

  const prefixedUri = _.startsWith(uri, '/') ? uri : `/${uri}`;
  const prefixedUriWithEnv = isDevelopment ? `${prefixedUri}` : prefixedUri;

  return `${apiHost}${prefixedUriWithEnv}`;
};

export {
  fixUriPrefix,
};
