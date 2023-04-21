const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';
const isPreRelease = process.env.NODE_ENV === 'prerelease';
const isOverseaTest = process.env.NODE_ENV === 'oversea';

const isQa = webpackDefine.IS_QA === 'qa';
const isOversea = !!webpackDefine.IS_Oversea || isOverseaTest;
const isChengxin = webpackDefine.IS_CHENGXIN === 'chengxin';

console.log(process.env, webpackDefine); // eslint-disable-line

export {
  isDevelopment,
  isPreRelease,
  isProduction,
  isQa,
  isOversea,
  isOverseaTest,
  isChengxin
};
