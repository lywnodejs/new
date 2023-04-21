// TODO 升级roadhog

import _ from 'lodash';
import postcss from 'postcss';
import px2rem from 'px2rem';

const px2remInclude = postcss.plugin('postcss-px2rem-include', function(
  options
) {
  return function(css, result) {
    if (
      options.include &&
      css.source.input.file.match(options.include) !== null
    ) {
      var oldCssText = css.toString();
      var px2remIns = new px2rem(options);
      var newCssText = px2remIns.generateRem(oldCssText);
      result.root = postcss.parse(newCssText);
      return;
    }

    result.root = css;
    return;
  };
});

const IS_Oversea = process.argv.indexOf('oversea') >= 0;

const babelPlugins = [
  'transform-runtime',
  [
    'import',
    [
      {
        libraryName: 'antd',
        libraryDirectory: 'lib',
        style: true
      },
      {
        libraryName: 'antd-mobile',
        style: true
      }
    ]
  ],
  [
    'module-resolver',
    {
      alias: {
        '@': './src',
        '@views': './src/views',
        '@components': './src/components',
        '@services': './src/services',
        '@config': './src/config',
        '@utils': './src/utils',
        '@routes': './src/routes',
        '@assets': './src/assets',
        '@style': './src/styles/style'
      }
    }
  ]
];

module.exports = {
  entry: {
    index: './src/entry/web/index.js',
    mobile: './src/entry/mobile/index.js'
    // index: './src/entry/mobile/index.js'
  },
  hash: true,
  publicPath: '/upm2-static/',
  disableCSSModules: true,
  theme: './src/themes/antdModifyVars.js',
  define: {
    // roadhog 1.x 版本 的DefinePlugin配置会使用 当前define属性进行extend
    // 所以这里不对 process.env 进行修改(使用其他的key，如webpackDefine)
    // 如果define中出现process.env，则会导致roadhog内部会出错
    // 详见： roadhog 1.x分支 src/config/common.js:287
    webpackDefine: {
      ..._.pick(process.env, ['IS_QA', 'IS_CHENGXIN']),
      // 海外版在构建时会传入 oversea 参数
      IS_Oversea
    }
  },
  multipage: true,
  env: {
    development: {
      extraBabelPlugins: ['dva-hmr', ...babelPlugins],
      extraPostCSSPlugins: [
        px2remInclude({
          remUnit: 75,
          include: /antd-mobile|mobile|mobile\.(less|css)$/i
        })
      ]
    },
    prerelease: {
      extraBabelPlugins: ['dva-hmr', ...babelPlugins],
      extraPostCSSPlugins: [
        // excludeFiles({
        //   filter: ['**/{src, node_modules}/**/*.*', '**/antd/**', '!**/mobile.*'],
        //   plugins: [px2rem({
        //     remUnit: 75
        //   })]
        // })
        px2remInclude({
          remUnit: 75,
          include: /antd-mobile|mobile|mobile\.(less|css)$/i
        })
      ]
    },
    oversea: {
      extraBabelPlugins: ['dva-hmr', ...babelPlugins],
      extraPostCSSPlugins: [
        px2remInclude({
          remUnit: 75,
          include: /antd-mobile|mobile|mobile\.(less|css)$/i
        })
      ]
    },
    production: {
      extraBabelPlugins: [...babelPlugins],
      extraPostCSSPlugins: [
        px2remInclude({
          remUnit: 75,
          include: /antd-mobile|mobile|mobile\.(less|css)$/i
        })
      ]
    }
  }
};
