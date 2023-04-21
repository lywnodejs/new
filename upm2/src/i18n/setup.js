import i18next from 'i18next';
import LngDetector from 'i18next-browser-languagedetector';

import enResource from './enUS/resource';
import zhResource from './zhCN/resource';
// import esResource from './esMX/resource';
// import jaResource from './jaJP/resource';
// import ptResource from './ptBR/resource';

const resources = {
  zhCN: {
    common: zhResource
  },
  enUS: {
    common: enResource
  },
  // esMX: {
  //   common: esResource
  // },
  // jaJP: {
  //   common: jaResource
  // },
  // ptBR: {
  //   common: ptResource
  // }
};

i18next
  .use(LngDetector)
  .init({
    fallbackLng: 'zhCN',
    defaultNS: 'common',
    returnEmptyString: false,
    // debug: true,
    resources,
    react: {
      wait: false,
    },
  }, (err, t) => {
    err && console.log(err);
  });

// 如果detector没有检测出正确的lng（包括resources未支持的），则set成中文
if (!resources[i18next.language]) {
  i18next.changeLanguage('zhCN');
}

export default i18next;
