const path = require('path');

module.exports = {
  //  部署应用时的基本 URL。用法和 webpack 本身的 output.publicPath 一致，
  //  但是 Vue CLI 在一些其他地方也需要用到这个值，
  //  所以请始终使用 baseUrl 而不要直接修改 webpack 的 output.publicPath.
  //  默认情况下，Vue CLI 会假设你的应用是被部署在一个域名的根路径上，
  //  例如 https://www.my-app.com/。如果应用被部署在一个子路径上，
  // 你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.my-app.com/my-app/，
  // 则设置 baseUrl 为 /my-app/。
  baseUrl: process.env.NODE_ENV === 'production' ? '/dist' : '/',

  // 将构建好的文件输出到哪里
  outputDir: 'dist',

  // 放置静态资源的地方 (js/css/img/font/...)
  assetsDir: 'assets',

  // 是否在保存的时候使用 `eslint-loader` 进行检查。
  // 有效的值：`ture` | `false` | `"error"`
  // 当设置为 `"error"` 时，检查出的错误会触发编译失败。
  lintOnSave: false,

  // 使用带有浏览器内编译器的完整构建版本
  // 查阅 https://cn.vuejs.org/v2/guide/installation.html#运行时-编译器-vs-只包含运行时
  // compiler: false,

  // babel-loader 默认会跳过 node_modules 依赖。
  // 通过这个选项可以显式转译一个依赖。
  transpileDependencies: [/* string or regex */],
  runtimeCompiler: true,
  // 是否为生产环境构建生成 source map？
  productionSourceMap: false,

  // 调整内部的 webpack 配置。
  // 查阅 https://github.com/vuejs/vue-docs-zh-cn/blob/master/vue-cli/webpack.md
  chainWebpack: () => {},
  configureWebpack: () => {},

  // CSS 相关选项
  css: {
    // 将组件内的 CSS 提取到一个单独的 CSS 文件 (只用在生产环境中)
    // 也可以是一个传递给 `extract-text-webpack-plugin` 的选项对象
    extract: true,

    // 是否开启 CSS source map？
    sourceMap: false,

    // 为预处理器的 loader 传递自定义选项。比如传递给
    // sass-loader 时，使用 `{ sass: { ... } }`。
    loaderOptions: {},

    // 为所有的 CSS 及其预处理文件开启 CSS Modules。
    // 这个选项不会影响 `*.vue` 文件。
    modules: false
  },

  // 在生产环境下为 Babel 和 TypeScript 使用 `thread-loader`
  // 在多核机器下会默认开启。
  // parallel: require('os').cpus().length > 1,

  // PWA 插件的选项。
  // 查阅 https://github.com/vuejs/vue-docs-zh-cn/blob/master/vue-cli-plugin-pwa/README.md
  // pwa: {},

  // 配置 webpack-dev-server 行为。
  devServer: {
    open: true,
    host: '0.0.0.0',
    port: 8080,
    https: false,
    hotOnly: true,
    // 查阅 https://github.com/vuejs/vue-docs-zh-cn/blob/master/vue-cli/cli-service.md#配置代理
    proxy: {
      '/api': {
        target: 'http://api-control.test.hxsapp.com',
        // target: 'https://open.ys7.com',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
        }
      }
    }, // string | Object
    before: app => {}
  },

  // 三方插件的选项
  pluginOptions: {
    // ...
  },

  // 修改webapck配置 webpack3里的配置升级webpack4
  // vue$: 'vue/dist/vue.esm.js',
  // components: path.resolve(__dirname, '../src/components'),
  // common: path.resolve(__dirname, '../src/common'),
  // pages: path.resolve(__dirname, '../src/pages'),
  // router: path.resolve(__dirname, '../src/router'),
  // store: path.resolve(__dirname, '../src/store'),
  // api: path.resolve(__dirname, '../src/api'),
  // assets: path.resolve(__dirname, '../src/assets'),
  // vendor: path.resolve(__dirname, '../src/vendor')
  // key,value自行定义，比如.set('@@', resolve('src/components'))
  chainWebpack: config => {
    config.resolve.alias
      .set('vue$', 'vue/dist/vue.esm.js')
      .set('@', path.resolve(__dirname, './src'))
      .set('components', path.resolve(__dirname, './src/components'))
      .set('common', path.resolve(__dirname, './src/common'))
      .set('pages', path.resolve(__dirname, './src/pages'))
      .set('router', path.resolve(__dirname, './src/router'))
      .set('store', path.resolve(__dirname, './src/store'))
      .set('api', path.resolve(__dirname, './src/api'))
      .set('assets', path.resolve(__dirname, './src/assets'))
  },
  // https://cli.vuejs.org/zh/guide/webpack.html#%E7%AE%80%E5%8D%95%E7%9A%84%E9%85%8D%E7%BD%AE%E6%96%B9%E5%BC%8F
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
    } else {
      // 为开发环境修改配置...
    }
  }
}