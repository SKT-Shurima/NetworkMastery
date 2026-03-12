import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(
  defineConfig({
    title: 'NetworkMastery',
    titleTemplate: ':title - NetworkMastery',
    description: '从 OSI 七层到 SD-WAN 智能路由的网络知识深度解析',
    lang: 'zh-CN',
    base: '/NetworkMastery/',
    ignoreDeadLinks: true,
    lastUpdated: true,
    cleanUrls: true,

    head: [
      ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes' }],
      ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
      ['meta', { name: 'theme-color', content: '#10b981' }],
      ['meta', { name: 'og:type', content: 'website' }],
      ['meta', { name: 'og:title', content: 'NetworkMastery - 网络知识完全掌握' }],
      ['meta', { name: 'og:description', content: '从 OSI 七层到 SD-WAN 智能路由的网络知识深度解析' }],
    ],

    themeConfig: {
      logo: '/logo.svg',
      siteTitle: 'NetworkMastery',

      // ─── 顶部导航栏 ───
      nav: [
        {
          text: '📖 学习指南',
          items: [
            {
              text: '入门基础',
              items: [
                { text: 'OSI 七层模型', link: '/guide/basics/osi' },
                { text: 'TCP/IP 协议栈', link: '/guide/basics/tcpip' },
                { text: 'IP 寻址与路由', link: '/guide/basics/routing' },
              ]
            },
            {
              text: '核心技术',
              items: [
                { text: 'IPSec 协议', link: '/guide/security/ipsec' },
                { text: 'MPLS 标签交换', link: '/guide/advanced/mpls' },
                { text: '网络拓扑', link: '/guide/architecture/topology' },
              ]
            }
          ]
        },
        {
          text: '⚡ SD-WAN',
          items: [
            { text: '概念与价值', link: '/guide/sdwan/concepts' },
            { text: '架构与控制面', link: '/guide/sdwan/architecture' },
            { text: '智能路由', link: '/guide/sdwan/routing' },
            { text: '安全设计', link: '/guide/sdwan/security' },
            { text: '实战案例', link: '/guide/sdwan/cases' },
          ]
        },
        {
          text: '🛡️ 安全',
          items: [
            { text: 'DDoS 攻击与防御', link: '/guide/attacks/ddos' },
            { text: '网络安全架构', link: '/guide/attacks/security-arch' },
            { text: '加密与身份认证', link: '/guide/attacks/encryption' },
          ]
        },
        { text: '❓ FAQ', link: '/faq' },
      ],

      // ─── 侧边栏 ───
      sidebar: {
        '/guide/': [
          {
            text: '🌐 网络基础',
            collapsed: false,
            items: [
              { text: 'OSI 七层模型', link: '/guide/basics/osi' },
              { text: 'TCP/IP 协议栈', link: '/guide/basics/tcpip' },
              { text: 'HTTP 协议详解', link: '/guide/basics/http' },
              { text: 'NAT 网络地址转换', link: '/guide/basics/nat' },
              { text: 'IP 寻址与路由', link: '/guide/basics/routing' },
            ]
          },
          {
            text: '🏢 企业网络架构',
            collapsed: false,
            items: [
              { text: '传统网络演进', link: '/guide/enterprise/traditional' },
              { text: '广域网 (WAN)', link: '/guide/enterprise/wan' },
              { text: '云网融合', link: '/guide/enterprise/cloud' },
            ]
          },
          {
            text: '⚡ SD-WAN 深度分析',
            collapsed: false,
            items: [
              { text: '概念与价值', link: '/guide/sdwan/concepts' },
              { text: '架构与控制面', link: '/guide/sdwan/architecture' },
              { text: '智能路由与流量优化', link: '/guide/sdwan/routing' },
              { text: '安全设计', link: '/guide/sdwan/security' },
              { text: '实战案例', link: '/guide/sdwan/cases' },
            ]
          },
          {
            text: '🔐 安全与隧道',
            collapsed: false,
            items: [
              { text: 'IPSec 协议详解', link: '/guide/security/ipsec' },
              { text: 'GRE 和网络隧道', link: '/guide/security/gre' },
              { text: 'MPLS 多协议标签交换', link: '/guide/advanced/mpls' },
              { text: 'VXLAN 虚拟网络', link: '/guide/advanced/vxlan' },
            ]
          },
          {
            text: '🛡️ 安全防御',
            collapsed: false,
            items: [
              { text: 'DDoS 攻击与防御', link: '/guide/attacks/ddos' },
              { text: '网络安全架构', link: '/guide/attacks/security-arch' },
              { text: '加密与身份认证', link: '/guide/attacks/encryption' },
            ]
          },
          {
            text: '🏗️ 网络架构',
            collapsed: false,
            items: [
              { text: '网络拓扑详解', link: '/guide/architecture/topology' },
              { text: '骨干网与分支网络', link: '/guide/architecture/backbone' },
            ]
          },
          {
            text: '🎯 QoS 与优化',
            collapsed: false,
            items: [
              { text: 'QoS 与流量工程', link: '/guide/qos/qos' },
              { text: '网络冗余与高可用', link: '/guide/qos/redundancy' },
              { text: '网络性能优化', link: '/guide/qos/performance' },
            ]
          },
          {
            text: '🔧 管理与运维',
            collapsed: true,
            items: [
              { text: '网络监控与可观测性', link: '/guide/ops/monitoring' },
              { text: '故障排查方法论', link: '/guide/ops/troubleshooting' },
              { text: '网络诊断与抓包分析', link: '/guide/ops/packet-analysis' },
            ]
          },
        ],
      },

      // ─── 右侧大纲 ───
      outline: {
        level: [2, 3],
        label: '本页目录'
      },

      // ─── 文档底部翻页 ───
      docFooter: {
        prev: '上一篇',
        next: '下一篇'
      },

      // ─── 最后更新时间 ───
      lastUpdated: {
        text: '最后更新',
        formatOptions: {
          dateStyle: 'short',
          timeStyle: 'short'
        }
      },

      // ─── 外部链接 ───
      socialLinks: [
        { icon: 'github', link: 'https://github.com/SKT-Shurima/NetworkMastery' }
      ],

      // ─── 页脚 ───
      footer: {
        message: '基于 VitePress 构建 · 从 OSI 七层到 SD-WAN 智能路由的深度解析',
        copyright: '© 2026 NetworkMastery. All Rights Reserved.'
      },

      // ─── 搜索 ───
      search: {
        provider: 'local',
        options: {
          translations: {
            button: {
              buttonText: '搜索文档',
              buttonAriaLabel: '搜索文档'
            },
            modal: {
              noResultsText: '没有找到结果',
              resetButtonTitle: '清除查询',
              footer: {
                selectText: '选择',
                navigateText: '切换',
                closeText: '关闭'
              }
            }
          }
        }
      },

      // ─── 404 页面 ───
      returnToTopLabel: '回到顶部',
      sidebarMenuLabel: '菜单',
      darkModeSwitchLabel: '主题',
      lightModeSwitchTitle: '切换到亮色模式',
      darkModeSwitchTitle: '切换到暗色模式',
    },

    // ─── Markdown 配置 ───
    markdown: {
      lineNumbers: true,
      image: {
        lazyLoading: true
      },
    },

    // ─── Mermaid 配置 ───
    mermaid: {
      theme: 'neutral',
      themeVariables: {
        primaryColor: '#d1fae5',
        primaryTextColor: '#065f46',
        primaryBorderColor: '#10b981',
        lineColor: '#6ee7b7',
        secondaryColor: '#ecfdf5',
        tertiaryColor: '#f0fdf4',
        fontFamily: 'Inter, -apple-system, sans-serif',
        fontSize: '14px',
      }
    },
    mermaidPlugin: {
      class: 'mermaid'
    },
  })
)
