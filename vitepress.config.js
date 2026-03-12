import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'NetworkMastery',
  description: '网络知识完全掌握 | 从 OSI 七层到 SD-WAN 智能路由的深度解析',
  lang: 'zh-CN',
  ignoreDeadLinks: true,
  
  themeConfig: {
    logo: '🌐',
    siteTitle: 'NetworkMastery',
    logoLink: '/',
    
    // 品牌色配置
    colors: {
      primary: '#0066cc',
      secondary: '#00cc88',
      danger: '#ff3333'
    },
    
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
          text: '安全与防御',
          items: [
            { text: 'IPSec 协议详解', link: '/guide/security/ipsec' },
            { text: 'GRE 和网络隧道', link: '/guide/security/gre' },
            { text: 'DDoS 攻击与防御', link: '/guide/attacks/ddos' },
            { text: '网络安全架构', link: '/guide/attacks/security-arch' },
            { text: '加密与身份认证', link: '/guide/attacks/encryption' }
          ]
        },
        {
          text: '高级主题',
          items: [
            { text: 'MPLS 多协议标签交换', link: '/guide/advanced/mpls' },
            { text: '网络拓扑详解', link: '/guide/architecture/topology' },
            { text: '骨干网与分支网络', link: '/guide/architecture/backbone' }
          ]
        },
        {
          text: 'QoS 与优化',
          items: [
            { text: '网络冗余与高可用', link: '/guide/qos/redundancy' },
            { text: 'QoS 与流量工程', link: '/guide/qos/qos' },
            { text: '网络性能优化', link: '/guide/qos/performance' }
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
