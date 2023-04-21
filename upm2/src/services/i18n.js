import { get } from '../utils/request';

const syncLanguage = (lang) => {
  lang = lang.replace(/([a-z])([A-Z])/, '$1_$2');
  return get('/v2/common/setlang', {
    lang,
  });
};

export {
  syncLanguage,
};
