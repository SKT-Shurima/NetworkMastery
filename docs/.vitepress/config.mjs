import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(
  defineConfig({
    title: 'NetworkMastery',
    titleTemplate: ':title - NetworkMastery',
    description: '从 OSI 七层到 SD-WAN 智能路由的网络知识深度解析',
    lang: 'zh-CN',
    base: '/NetworkMastery/',
    ignoreDeadLinks: false,
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
          text: '📖 网络基石',
          items: [
            {
              text: '协议与服务',
              items: [
                { text: 'OSI 七层模型', link: '/guide/basics/osi' },
                { text: 'TCP/IP 协议栈', link: '/guide/basics/tcpip' },
                { text: 'HTTP 协议演进', link: '/guide/basics/http' },
                { text: 'QUIC 与 HTTP/3', link: '/guide/basics/quic-http3' },
                { text: 'TLS 1.3 详解', link: '/guide/basics/tls' },
              ]
            },
            {
              text: '路由与交换',
              items: [
                { text: 'DNS 域名解析', link: '/guide/basics/dns' },
                { text: 'IP 寻址与路由', link: '/guide/basics/routing' },
                { text: 'OSPF 路由协议', link: '/guide/routing/ospf' },
                { text: 'BGP 深入解析', link: '/guide/routing/bgp' },
                { text: 'IS-IS 路由协议', link: '/guide/routing/isis' },
              ]
            }
          ]
        },
        {
          text: '🏢 企业网络',
          items: [
            {
              text: '架构与安全',
              items: [
                { text: '传统网络演进', link: '/guide/enterprise/traditional' },
                { text: '防火墙技术', link: '/guide/security/firewall' },
                { text: '零信任架构', link: '/guide/security/zero-trust' },
                { text: 'IDS/IPS 入侵防御', link: '/guide/security/ids-ips' },
                { text: 'PKI 证书体系', link: '/guide/security/pki' },
              ]
            },
            {
              text: '无线与优化',
              items: [
                { text: 'Wi-Fi 6/6E/7 标准', link: '/guide/wireless/wifi-standards' },
                { text: 'Wi-Fi 安全 WPA3', link: '/guide/wireless/wifi-security' },
                { text: 'QoS 流量工程', link: '/guide/qos/qos' },
                { text: '网络准入控制 NAC', link: '/guide/security/nac' },
              ]
            }
          ]
        },
        {
          text: '⚡ 网络演进',
          items: [
            {
              text: '隧道与 Overlay',
              items: [
                { text: 'IPSec 协议', link: '/guide/security/ipsec' },
                { text: 'MPLS 标签交换', link: '/guide/advanced/mpls' },
                { text: 'VXLAN 虚拟网络', link: '/guide/advanced/vxlan' },
                { text: 'EVPN 以太网VPN', link: '/guide/routing/evpn' },
                { text: '段路由 SR-MPLS/SRv6', link: '/guide/routing/segment-routing' },
              ]
            },
            {
              text: 'SDN & SD-WAN',
              items: [
                { text: 'SDN 基础理论', link: '/guide/sdn/fundamentals' },
                { text: 'SD-WAN 概念与价值', link: '/guide/sdwan/concepts' },
                { text: 'SD-WAN 实战案例', link: '/guide/sdwan/cases' },
              ]
            }
          ]
        },
        {
          text: '☁️ 云与数据中心',
          items: [
            {
              text: '云原生网络',
              items: [
                { text: 'AWS 云网络', link: '/guide/cloud/aws-networking' },
                { text: 'Azure 云网络', link: '/guide/cloud/azure-networking' },
                { text: 'Kubernetes 网络', link: '/guide/cloud/kubernetes-networking' },
                { text: '服务网格 Istio', link: '/guide/cloud/service-mesh' },
                { text: '多云网络架构', link: '/guide/cloud/multi-cloud' },
              ]
            },
            {
              text: '数据中心',
              items: [
                { text: 'Spine-Leaf 架构', link: '/guide/datacenter/spine-leaf' },
                { text: '数据中心互联 DCI', link: '/guide/datacenter/dci' },
                { text: '存储网络 iSCSI/FC', link: '/guide/datacenter/storage-networking' },
                { text: '网络功能虚拟化 NFV', link: '/guide/datacenter/nfv' },
              ]
            }
          ]
        },
        {
          text: '🤖 自动化与前沿',
          items: [
            {
              text: '网络自动化',
              items: [
                { text: 'NETCONF/YANG/RESTCONF', link: '/guide/automation/netconf-yang' },
                { text: 'Python 网络编程', link: '/guide/automation/python-networking' },
                { text: 'Ansible 网络自动化', link: '/guide/automation/ansible-network' },
                { text: '网络 CI/CD 流水线', link: '/guide/automation/network-cicd' },
              ]
            },
            {
              text: '前沿技术',
              items: [
                { text: '5G 核心网', link: '/guide/emerging/5g-networking' },
                { text: '意图驱动网络 IBN', link: '/guide/emerging/intent-based-networking' },
                { text: 'AIOps 智能运维', link: '/guide/emerging/aiops-networking' },
                { text: 'IoT 网络协议', link: '/guide/emerging/iot-protocols' },
              ]
            }
          ]
        },
        { text: '❓ FAQ', link: '/faq' },
      ],

      // ─── 侧边栏（6 篇 18 章渐进式结构）───
      sidebar: {
        '/guide/': [
          // ══════════════════════════════════════════
          // 第一篇：网络基石（零基础可读）
          // ══════════════════════════════════════════
          {
            text: '第一篇：网络基石',
            items: [
              {
                text: 'Ch1 网络模型与协议',
                collapsed: false,
                items: [
                  { text: 'OSI 七层模型', link: '/guide/basics/osi' },
                  { text: 'TCP/IP 协议栈', link: '/guide/basics/tcpip' },
                  { text: 'HTTP 协议详解', link: '/guide/basics/http' },
                  { text: 'QUIC 与 HTTP/3', link: '/guide/basics/quic-http3' },
                  { text: 'TLS 1.3 详解', link: '/guide/basics/tls' },
                ]
              },
              {
                text: 'Ch2 核心网络服务',
                collapsed: false,
                items: [
                  { text: 'DHCP 动态主机配置', link: '/guide/basics/dhcp' },
                  { text: 'DNS 域名解析', link: '/guide/basics/dns' },
                  { text: 'NAT 网络地址转换', link: '/guide/basics/nat' },
                  { text: 'IPv6 下一代协议', link: '/guide/basics/ipv6' },
                  { text: '邮件协议体系', link: '/guide/basics/email-protocols' },
                ]
              },
              {
                text: 'Ch3 交换与路由基础',
                collapsed: false,
                items: [
                  { text: '以太网交换原理', link: '/guide/basics/switching' },
                  { text: 'VLAN 虚拟局域网', link: '/guide/basics/vlans-advanced' },
                  { text: 'IP 寻址与路由', link: '/guide/basics/routing' },
                  { text: 'OSPF 路由协议', link: '/guide/routing/ospf' },
                  { text: 'IS-IS 路由协议', link: '/guide/routing/isis' },
                  { text: '策略路由与路由重分发', link: '/guide/routing/policy-routing' },
                ]
              },
            ]
          },

          // ══════════════════════════════════════════
          // 第二篇：企业网络（面向网络管理员）
          // ══════════════════════════════════════════
          {
            text: '第二篇：企业网络',
            items: [
              {
                text: 'Ch4 企业网络架构',
                collapsed: true,
                items: [
                  { text: '传统网络演进', link: '/guide/enterprise/traditional' },
                  { text: '广域网 (WAN)', link: '/guide/enterprise/wan' },
                  { text: '网络拓扑详解', link: '/guide/architecture/topology' },
                  { text: '骨干网与分支网络', link: '/guide/architecture/backbone' },
                  { text: '负载均衡技术', link: '/guide/architecture/load-balancing' },
                  { text: '架构设计最佳实践', link: '/guide/architecture/design-best-practices' },
                ]
              },
              {
                text: 'Ch5 安全体系',
                collapsed: true,
                items: [
                  { text: '防火墙技术', link: '/guide/security/firewall' },
                  { text: '加密与身份认证', link: '/guide/attacks/encryption' },
                  { text: 'DDoS 攻击与防御', link: '/guide/attacks/ddos' },
                  { text: 'DDoS 防御实战', link: '/guide/attacks/ddos-defense' },
                  { text: '网络安全架构', link: '/guide/attacks/security-arch' },
                  { text: '零信任架构', link: '/guide/security/zero-trust' },
                  { text: 'IDS/IPS 入侵检测防御', link: '/guide/security/ids-ips' },
                  { text: '网络准入控制 NAC', link: '/guide/security/nac' },
                  { text: 'PKI 与数字证书', link: '/guide/security/pki' },
                  { text: 'SIEM 与安全运营中心', link: '/guide/security/siem' },
                ]
              },
              {
                text: 'Ch6 QoS 与优化',
                collapsed: true,
                items: [
                  { text: 'QoS 与流量工程', link: '/guide/qos/qos' },
                  { text: '流量整形技术', link: '/guide/qos/traffic-shaping' },
                  { text: '带宽分配策略', link: '/guide/qos/bandwidth-allocation' },
                  { text: '网络冗余与高可用', link: '/guide/qos/redundancy' },
                  { text: '网络性能优化', link: '/guide/qos/performance' },
                  { text: 'WAN 加速与优化', link: '/guide/enterprise/wan-optimization' },
                ]
              },
            ]
          },

          // ══════════════════════════════════════════
          // 第三篇：网络演进（面向架构师）
          // ══════════════════════════════════════════
          {
            text: '第三篇：网络演进',
            items: [
              {
                text: 'Ch7 隧道与 Overlay',
                collapsed: true,
                items: [
                  { text: 'IPSec 协议详解', link: '/guide/security/ipsec' },
                  { text: 'GRE 和网络隧道', link: '/guide/security/gre' },
                  { text: 'MPLS 多协议标签交换', link: '/guide/advanced/mpls' },
                  { text: 'VXLAN 虚拟扩展网络', link: '/guide/advanced/vxlan' },
                  { text: 'WireGuard 现代 VPN', link: '/guide/vpn/wireguard' },
                ]
              },
              {
                text: 'Ch8 SDN 软件定义网络',
                collapsed: true,
                items: [
                  { text: 'SDN 基础理论', link: '/guide/sdn/fundamentals' },
                  { text: 'SDN 控制器架构', link: '/guide/sdn/controllers' },
                ]
              },
              {
                text: 'Ch9 SD-WAN 深度剖析',
                collapsed: true,
                items: [
                  { text: '概念与价值', link: '/guide/sdwan/concepts' },
                  { text: '架构与控制面', link: '/guide/sdwan/architecture' },
                  { text: '智能路由与流量优化', link: '/guide/sdwan/routing' },
                  { text: '安全设计', link: '/guide/sdwan/security' },
                  { text: '实战案例', link: '/guide/sdwan/cases' },
                ]
              },
            ]
          },

          // ══════════════════════════════════════════
          // 第四篇：实战进阶（面向专家）
          // ══════════════════════════════════════════
          {
            text: '第四篇：实战进阶',
            items: [
              {
                text: 'Ch10 云网融合',
                collapsed: true,
                items: [
                  { text: '云网融合架构', link: '/guide/enterprise/cloud' },
                  { text: '容器网络', link: '/guide/cloud/container-networking' },
                  { text: '混合云互联', link: '/guide/cloud/hybrid-networking' },
                  { text: '数字化转型', link: '/guide/enterprise/digital-transformation' },
                ]
              },
              {
                text: 'Ch11 网络运维',
                collapsed: true,
                items: [
                  { text: '网络监控与可观测性', link: '/guide/ops/monitoring' },
                  { text: 'NetFlow/IPFIX 流量分析', link: '/guide/ops/netflow' },
                  { text: 'SNMP v3 与 MIB 管理', link: '/guide/ops/snmp-advanced' },
                  { text: 'eBPF 网络可观测性', link: '/guide/ops/ebpf-networking' },
                  { text: '故障排查方法论', link: '/guide/ops/troubleshooting' },
                  { text: '高级故障排查', link: '/guide/ops/troubleshooting-advanced' },
                  { text: '网络诊断与抓包分析', link: '/guide/ops/packet-analysis' },
                  { text: '应急响应', link: '/guide/ops/incident-response' },
                ]
              },
              {
                text: 'Ch12 路由进阶',
                collapsed: true,
                items: [
                  { text: 'BGP 深入解析', link: '/guide/routing/bgp' },
                  { text: 'BGP 高级特性', link: '/guide/advanced/bgp' },
                  { text: 'EVPN 以太网VPN', link: '/guide/routing/evpn' },
                  { text: '段路由 SR-MPLS 与 SRv6', link: '/guide/routing/segment-routing' },
                  { text: '组播技术', link: '/guide/advanced/multicast' },
                  { text: '网络切片', link: '/guide/advanced/network-slicing' },
                ]
              },
            ]
          },

          // ══════════════════════════════════════════
          // 第五篇：无线与自动化（新增）
          // ══════════════════════════════════════════
          {
            text: '第五篇：无线与自动化',
            items: [
              {
                text: 'Ch13 无线网络',
                collapsed: true,
                items: [
                  { text: 'Wi-Fi 6/6E/7 无线标准', link: '/guide/wireless/wifi-standards' },
                  { text: 'Wi-Fi 安全 WPA3', link: '/guide/wireless/wifi-security' },
                  { text: 'Mesh 无线网络架构', link: '/guide/wireless/mesh-networking' },
                  { text: '企业 Wi-Fi 规划与优化', link: '/guide/wireless/wifi-planning' },
                ]
              },
              {
                text: 'Ch14 网络自动化',
                collapsed: true,
                items: [
                  { text: 'NETCONF/YANG/RESTCONF', link: '/guide/automation/netconf-yang' },
                  { text: 'Python 网络编程', link: '/guide/automation/python-networking' },
                  { text: 'Ansible 网络自动化', link: '/guide/automation/ansible-network' },
                  { text: 'IaC：Terraform 网络管理', link: '/guide/automation/iac-networking' },
                  { text: '网络 CI/CD 流水线', link: '/guide/automation/network-cicd' },
                ]
              },
            ]
          },

          // ══════════════════════════════════════════
          // 第六篇：数据中心与云原生（新增）
          // ══════════════════════════════════════════
          {
            text: '第六篇：数据中心与云原生',
            items: [
              {
                text: 'Ch15 数据中心网络',
                collapsed: true,
                items: [
                  { text: 'Spine-Leaf 现代数据中心架构', link: '/guide/datacenter/spine-leaf' },
                  { text: '数据中心互联 DCI', link: '/guide/datacenter/dci' },
                  { text: '存储网络 iSCSI/FC/NVMe-oF', link: '/guide/datacenter/storage-networking' },
                  { text: '网络功能虚拟化 NFV', link: '/guide/datacenter/nfv' },
                ]
              },
              {
                text: 'Ch16 云原生网络',
                collapsed: true,
                items: [
                  { text: 'AWS 云网络', link: '/guide/cloud/aws-networking' },
                  { text: 'Azure 云网络', link: '/guide/cloud/azure-networking' },
                  { text: 'Kubernetes 网络模型', link: '/guide/cloud/kubernetes-networking' },
                  { text: '服务网格 Istio', link: '/guide/cloud/service-mesh' },
                  { text: '多云网络架构', link: '/guide/cloud/multi-cloud' },
                ]
              },
              {
                text: 'Ch17 前沿技术',
                collapsed: true,
                items: [
                  { text: '5G 核心网与网络切片', link: '/guide/emerging/5g-networking' },
                  { text: '意图驱动网络 IBN', link: '/guide/emerging/intent-based-networking' },
                  { text: 'AIOps 智能网络运维', link: '/guide/emerging/aiops-networking' },
                  { text: 'IoT 网络协议', link: '/guide/emerging/iot-protocols' },
                ]
              },
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

      // ─── UI 文案 ───
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

    // ─── Mermaid 配置 (优化视觉效果) ───
    mermaid: {
      theme: 'base',
      themeVariables: {
        primaryColor: '#0ea5e9',
        primaryTextColor: '#ffffff',
        primaryBorderColor: '#0284c7',
        lineColor: '#475569',
        secondaryColor: '#06b6d4',
        secondaryTextColor: '#ffffff',
        secondaryBorderColor: '#0891b2',
        tertiaryColor: '#10b981',
        tertiaryTextColor: '#ffffff',
        tertiaryBorderColor: '#059669',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '16px',
        fontSizeLarge: '18px',
        borderRadius: '8px',
        lineStrokeWidth: '2px',
        accentColor: '#f59e0b',
        dangerColor: '#ef4444',
        warningColor: '#f59e0b',
        successColor: '#10b981',
      },
      securityLevel: 'loose',
      startOnLoad: true,
      gantt: {
        numberSectionStyles: 3,
        fontSize: 14,
      },
      flowchart: {
        htmlLabels: true,
        useMaxWidth: true,
        padding: 20,
      }
    },
    mermaidPlugin: {
      class: 'mermaid'
    },
  })
)
