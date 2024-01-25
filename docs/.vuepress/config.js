const path = require('path')
module.exports = {
  title: '日常记录',
  base: '/work',
  description: '日常记录',
  head: [
    ['link', { rel: 'icon', href: `logo.png` }],
    ['meta', { name: 'theme-color', content: '#1890ff' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    [
      'meta',
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
    ],
    ['meta', { name: 'msapplication-TileColor', content: '#000000' }],
  ],
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.join(__dirname, 'public', 'assets'),
      },
    },
  },
  themeConfig: {
    lastUpdated: '上次更新',
    nav: [
      { text: '首页', link: '/' },
      { text: '设计模式', link: '/design/' },
      { text: 'antd 工作记录', link: '/antd/' },
      { text: 'vue3 造轮子',  link:"https://helloonetwo.github.io/xiao-ui-website/#/" }
    ],
    navbar: true,
    sidebar: {
      collapsable: true,
      '/design/': [
        {
          title: '设计模式',
          collapsable: false,
          children: [
            '工厂模式',
            '单例模式',
            '观察者模式',
            '发布订阅模式',
            '策略模式',
            '代理模式',
          ],
        },
      ],
      '/antd/': [
        {
          title: 'antd工作记录',
          collapsable: false,
          children: [
            '表格',
            'searchForm搜索框组件'
          ],
        },
      ],
    },
  },
  plugins: [
    '@vuepress/back-to-top',
    [
      '@vuepress/active-header-links',
      {
        sidebarLinkSelector: '.sidebar-link',
        headerAnchorSelector: '.header-anchor',
      },
    ],
    [
      'vuepress-plugin-code-copy',
      {
        color: '#808080',
        successText: '复制成功',
      },
    ],
    '@vuepress/nprogress',
  ],
}
