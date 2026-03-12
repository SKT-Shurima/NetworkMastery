import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '网络知识详解',
  description: '深入探讨网络架构与 SD-WAN 技术',
  lang: 'zh-CN',
  ignoreDeadLinks: true,
  
  themeConfig: {
    logo: '🍮',
    siteTitle: '网络知识详解',
    
    nav: [
      { text: '首页', link: '/' },
      { text: '基础知识', link: '/guide/basics' },
      { text: '企业架构', link: '/guide/enterprise' },
      { text: 'SD-WAN', link: '/guide/sdwan' },
      { text: '运维管理', link: '/guide/ops' },
      { text: 'FAQ', link: '/faq' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: '基础知识',
          items: [
            { text: 'OSI 七层模型', link: '/guide/basics/osi' },
            { text: 'TCP/IP 协议栈', link: '/guide/basics/tcpip' },
            { text: 'IP 寻址与路由', link: '/guide/basics/routing' }
          ]
        },
        {
          text: '企业网络架构',
          items: [
            { text: '传统网络演进', link: '/guide/enterprise/traditional' },
            { text: '广域网 (WAN)', link: '/guide/enterprise/wan' },
            { text: '云网融合', link: '/guide/enterprise/cloud' }
          ]
        },
        {
          text: 'SD-WAN 深度分析',
          items: [
            { text: '概念与价值', link: '/guide/sdwan/concepts' },
            { text: '架构与控制面', link: '/guide/sdwan/architecture' },
            { text: '智能路由与流量优化', link: '/guide/sdwan/routing' },
            { text: '安全设计', link: '/guide/sdwan/security' },
            { text: '实战案例', link: '/guide/sdwan/cases' }
          ]
        },
        {
          text: '网络管理与运维',
          items: [
            { text: '网络监控与可观测性', link: '/guide/ops/monitoring' },
            { text: '故障排查方法论', link: '/guide/ops/troubleshooting' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com' }
    ],

    footer: {
      message: '深入理解现代网络架构，掌握 SD-WAN 技术的核心与实战',
      copyright: '© 2026 网络知识详解. All Rights Reserved.'
    },

    search: {
      provider: 'local'
    }
  },

  markdown: {
    lineNumbers: true
  }
})
