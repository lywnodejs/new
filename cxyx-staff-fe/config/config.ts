import { defineConfig } from 'umi';
import routes from './route';
import proxy from './proxy';
import path from 'path';
import fs from 'fs';
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath: string) =>
  path.resolve(appDirectory, relativePath);
const packageJsonPath = resolveApp('package.json');
const WebpackGiftOssPlugin = require('@didi/webpack-gift-oss-plugin');

// 注意：上传host和cdn服务的host不是同一个
const cdnGiftUrl = 'https://s3-gz01.didistatic.com';
// 静态资源上传cdnGiftUploadHost，勿配置协议头
const cdnGiftUploadHost = 's3-gzpu.didistatic.com';
const appName = require(packageJsonPath).name;
const bucketName = 'default';

const online = process.env.OE_BUILD_ENV === 'production' && appName;

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  dva: {
    immer: true,
  },
  // mock: +process.env.MOCK === 1 ? {} : false,
  define: {
    _ENV: process.env.ENV,
  },
  publicPath: online ? `${cdnGiftUrl}/${bucketName}/${appName}/` : '/',
  // publicPath: '/',
  chainWebpack(config) {
    if (online) {
      config.plugin('webpack-gift-oss-plugin').use(WebpackGiftOssPlugin, [
        {
          host: cdnGiftUploadHost,
          bucketName: bucketName,
          projectName: appName,
          accessKey: 'AKDD00000000000YHLEI4ASXRJQYVD',
          secretKey: 'ASDDQQZXAZQcHLTvLqSiVSZsJAlrAJAIHHDPghAh',
        },
      ]);
    }
  },
  // antd: {
  //   compact: true,
  // },
  title: '「孙权」橙心账号权限管理系统',
  favicon: '/assets/favicon.ico',
  outputPath: 'build',
  hash: online ? true : false,
  history: {
    type: 'hash',
  },
  routes,
  proxy,
  // 通过 exportStatic 结合 ssr 开启预渲染
  // ssr: {},
  // exportStatic: {},
  theme: {
    'primary-color': '#FC9153',
  },
  layout: {
    // 支持任何不需要 dom 的
    // https://procomponents.ant.design/components/layout#prolayout
    name: '「孙权」橙心账号权限管理系统',
    layout: 'side',
    logo:
      'https://s3-gz01.didistatic.com/default/marketing-fe/static/media/logo_full.521d5fc3.521d5fc3.png',
  },
});
