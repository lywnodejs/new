import {
  isProduction
} from './env';

let BIG_DATA_APP_ID = {
  1182: true,
  204: true,
};

if (isProduction) {
  BIG_DATA_APP_ID = {
    280: true,
    1620: true,
    204:true
  };
}

export {
  BIG_DATA_APP_ID
};
