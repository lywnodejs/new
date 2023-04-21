const cssLoaderConfig = require('@zeit/next-css/css-loader-config')
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin')
const lessToJS = require('less-vars-to-js')
const withImages = require('next-images')
const fs = require('fs')
const path = require('path')

const withLess = (nextConfig = {}) => {
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      if (!options.defaultLoaders) {
        throw new Error(
          'This plugin is not compatible with Next.js versions below 5.0.0 https://err.sh/next-plugins/upgrade',
        )
      }

      const {dev, isServer} = options
      const {
        cssModules,
        cssLoaderOptions,
        postcssLoaderOptions,
        lessLoaderOptions = {},
      } = nextConfig

      options.defaultLoaders.less = cssLoaderConfig(config, {
        extensions: ['less'],
        cssModules,
        cssLoaderOptions,
        postcssLoaderOptions,
        dev,
        isServer,
        loaders: [
          {
            loader: 'less-loader',
            options: lessLoaderOptions,
          },
        ],
      })

      config.module.rules.push({
        test: /\.less$/,
        exclude: /node_modules/,
        use: options.defaultLoaders.less,
      })

      // 我们禁用了antd的cssModules
      config.module.rules.push({
        test: /\.less$/,
        include: /node_modules/,
        use: cssLoaderConfig(config, {
          extensions: ['less'],
          cssModules: false,
          cssLoaderOptions: {},
          dev,
          isServer,
          loaders: [
            {
              loader: 'less-loader',
              options: lessLoaderOptions,
            },
          ],
        }),
      })

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options)
      }

      return config
    },
  })
}

const withCSS = (nextConfig = {}) => {
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      if (!options.defaultLoaders) {
        throw new Error(
          'This plugin is not compatible with Next.js versions below 5.0.0 https://err.sh/next-plugins/upgrade',
        )
      }

      const {dev, isServer} = options
      const {cssModules, cssLoaderOptions, postcssLoaderOptions} = nextConfig

      options.defaultLoaders.css = cssLoaderConfig(config, {
        extensions: ['css'],
        cssModules: false,
        cssLoaderOptions,
        postcssLoaderOptions,
        dev,
        isServer,
      })

      config.module.rules.push({
        test: /\.css$/,
        use: options.defaultLoaders.css,
      })

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options)
      }

      return config
    },
  })
}

// Where your antd-custom.less file lives
const themeVariables = lessToJS(
  fs.readFileSync(path.resolve(__dirname, './assets/antd-custom.less'), 'utf8'),
)

module.exports = withImages(
  withCSS(
    withLess({
      env: {
        PORT: process.env.PORT || 3000,
      },
      cssModules: true,
      lessLoaderOptions: {
        javascriptEnabled: true,
        modifyVars: themeVariables, // make your antd custom effective
      },
      webpack: (config, {isServer}) => {
        config.resolve.alias['~'] = path.resolve(__dirname)

        if (isServer) {
          const antStyles = /antd\/.*?\/style.*?/
          const origExternals = [...config.externals]
          config.externals = [
            (context, request, callback) => {
              if (request.match(antStyles)) return callback()
              if (typeof origExternals[0] === 'function') {
                origExternals[0](context, request, callback)
              } else {
                callback()
              }
            },
            ...(typeof origExternals[0] === 'function' ? [] : origExternals),
          ]

          config.module.rules.unshift({
            test: antStyles,
            use: 'null-loader',
          })
        }

        config.plugins.push(
          new FilterWarningsPlugin({
            exclude: /mini-css-extract-plugin[^]*Conflicting order between:/,
          }),
        )

        return config
      },
    }),
  ),
)
