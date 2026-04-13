const CompressionPlugin = require('compression-webpack-plugin');
const { defineConfig } = require('@vue/cli-service');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = defineConfig({
  transpileDependencies: ["vuetify"],
  devServer: {
    port: 8081,
    proxy: {
      "/api": {
        target: "http://backend:8080",
        changeOrigin: true,
        pathRewrite: {
          "^/api": ""
        }
      }
    },
    allowedHosts: 'all'
  },
  // GitHub Pages 部署路径：仓库名为 Learning，所以 publicPath 为 /Learning/blog/
  // 如果你的仓库名不同，请修改此处
  publicPath: process.env.NODE_ENV === 'production'
    ? (process.env.PUBLIC_PATH || '/MyPage/')
    : '/',
  productionSourceMap: false,
  configureWebpack: {
    plugins: [
      new CompressionPlugin({
        test: /\.(js|css|html|ttf|woff|woff2)$/,
        threshold: 10240,
        minRatio: 0.8
      })
    ],
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true,
              drop_debugger: true,
              pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn', 'this.log'],
              passes: 2
            },
            mangle: true,
            keep_fnames: false
          },
          extractComments: false,
          parallel: true
        })
      ],
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: 30,
        minSize: 20000,
        maxSize: 250000,
        cacheGroups: {
          bytemd: {
            test: /[\\/]node_modules[\\/]@bytemd[\\/]/,
            name: 'bytemd-chunk',
            priority: 20
          },
          mermaid: {
            test: /[\\/]node_modules[\\/]mermaid[\\/]/,
            name: 'mermaid-chunk',
            priority: 20
          },
          highlight: {
            test: /[\\/]node_modules[\\/]highlight.js[\\/]/,
            name: 'highlight-chunk',
            priority: 20
          },
          katex: {
            test: /[\\/]node_modules[\\/]katex[\\/]/,
            name: 'katex-chunk', 
            priority: 20
          },
          markdown: {
            test: /[\\/]node_modules[\\/]markdown-it[\\/]/,
            name: 'markdown-chunk',
            priority: 20
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const match = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
              const packageName = match ? match[1] : 'vendors';
              return `npm.${packageName.replace('@', '')}`;
            },
            priority: 10
          }
        }
      },
    },
    resolve: {
      fallback: {
        "timers": require.resolve("timers-browserify")
      }
    }
  },
  lintOnSave: false,
  css: {
    loaderOptions: {
      sass: {
        implementation: require('sass'),
        sassOptions: {
          quietDeps: true
        }
      }
    }
  },
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = 'FishBlog'  // 设置你的网站标题
      args[0].title = 'AllureBlog'
      args[0].minify = {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: false
      }
      return args
    })
    config.optimization.splitChunks({
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 20000,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            const match = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
            const packageName = match ? match[1] : 'vendors';
            return `npm.${packageName.replace('@', '')}`;
          }
        }
      }
    });
  }
});
