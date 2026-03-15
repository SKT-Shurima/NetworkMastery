// 学习路径配置
export const learningPaths = {
  basics: {
    id: 'basics',
    title: '网络基础',
    icon: '🌐',
    level: 'beginner',
    estimatedHours: 8,
    articles: [
      {
        title: 'OSI 七层模型',
        path: '/guide/basics/osi',
        topics: ['网络分层', '协议栈', '数据封装'],
        duration: 45
      },
      {
        title: 'TCP/IP 协议栈',
        path: '/guide/basics/tcpip',
        topics: ['TCP', 'IP', '三次握手'],
        duration: 60
      },
      {
        title: 'IP 寻址与路由',
        path: '/guide/basics/routing',
        topics: ['子网划分', '路由表', 'CIDR'],
        duration: 50
      }
    ]
  },
  
  security: {
    id: 'security',
    title: '安全与隧道',
    icon: '🔐',
    level: 'intermediate',
    estimatedHours: 10,
    articles: [
      {
        title: 'IPSec 协议详解',
        path: '/guide/security/ipsec',
        topics: ['加密', 'IKE', 'ESP/AH'],
        duration: 70
      },
      {
        title: 'GRE 和网络隧道',
        path: '/guide/security/gre',
        topics: ['隧道协议', 'Overlay', 'Encapsulation'],
        duration: 50
      },
      {
        title: 'MPLS 多协议标签交换',
        path: '/guide/advanced/mpls',
        topics: ['标签交换', 'LDP', 'VPN'],
        duration: 80
      }
    ]
  },
  
  architecture: {
    id: 'architecture',
    title: '网络架构',
    icon: '🏗️',
    level: 'intermediate',
    estimatedHours: 6,
    articles: [
      {
        title: '网络拓扑详解',
        path: '/guide/architecture/topology',
        topics: ['Star', 'Mesh', 'Hub-Spoke'],
        duration: 55
      },
      {
        title: '骨干网与分支网络',
        path: '/guide/architecture/backbone',
        topics: ['分层设计', '冗余', '扩展性'],
        duration: 50
      }
    ]
  },
  
  defense: {
    id: 'defense',
    title: '安全防御',
    icon: '🛡️',
    level: 'advanced',
    estimatedHours: 12,
    articles: [
      {
        title: 'DDoS 攻击与防御',
        path: '/guide/attacks/ddos',
        topics: ['SYN Flood', '反射放大', '清洗'],
        duration: 70
      },
      {
        title: '网络安全架构',
        path: '/guide/attacks/security-arch',
        topics: ['纵深防御', '零信任', 'SASE'],
        duration: 80
      },
      {
        title: '加密与身份认证',
        path: '/guide/attacks/encryption',
        topics: ['PKI', 'TLS', 'MFA'],
        duration: 60
      }
    ]
  },
  
  sdwan: {
    id: 'sdwan',
    title: 'SD-WAN 核心',
    icon: '⚡',
    level: 'advanced',
    estimatedHours: 15,
    articles: [
      {
        title: 'SD-WAN 概念与价值',
        path: '/guide/sdwan/concepts',
        topics: ['业务驱动', 'Overlay', '应用感知'],
        duration: 60
      },
      {
        title: 'SD-WAN 架构与控制面',
        path: '/guide/sdwan/architecture',
        topics: ['Controller', 'Orchestrator', 'vEdge'],
        duration: 80
      },
      {
        title: '智能路由与流量优化',
        path: '/guide/sdwan/routing',
        topics: ['路径选择', 'SLA', '流量工程'],
        duration: 90
      },
      {
        title: 'SD-WAN 安全设计',
        path: '/guide/sdwan/security',
        topics: ['VPN', 'Segmentation', '云安全'],
        duration: 70
      },
      {
        title: 'SD-WAN 实战案例',
        path: '/guide/sdwan/cases',
        topics: ['部署', '迁移', '运维'],
        duration: 80
      }
    ]
  },
  
  qos: {
    id: 'qos',
    title: 'QoS 与优化',
    icon: '🎯',
    level: 'advanced',
    estimatedHours: 9,
    articles: [
      {
        title: 'QoS 与流量工程',
        path: '/guide/qos/qos',
        topics: ['DSCP', '队列', '整形'],
        duration: 70
      },
      {
        title: '网络冗余与高可用',
        path: '/guide/qos/redundancy',
        topics: ['VRRP', 'BFD', '故障切换'],
        duration: 60
      },
      {
        title: '网络性能优化',
        path: '/guide/qos/performance',
        topics: ['TCP 优化', 'WAN 加速', 'Caching'],
        duration: 70
      }
    ]
  }
}

// 学习等级定义
export const levels = {
  beginner: {
    label: '入门',
    color: '#00ff41',
    description: '适合网络新手，建立基础知识框架'
  },
  intermediate: {
    label: '进阶',
    color: '#00f0ff',
    description: '需要一定网络基础，深入技术细节'
  },
  advanced: {
    label: '高级',
    color: '#8b5cf6',
    description: '面向有经验工程师，聚焦架构与实战'
  }
}

// 推荐学习顺序
export const recommendedOrder = ['basics', 'security', 'architecture', 'sdwan', 'defense', 'qos']

// 获取总学习时长
export function getTotalHours() {
  return Object.values(learningPaths).reduce((sum, path) => sum + path.estimatedHours, 0)
}

// 获取总文章数
export function getTotalArticles() {
  return Object.values(learningPaths).reduce((sum, path) => sum + path.articles.length, 0)
}

// 获取学习进度（从 localStorage）
export function getProgress(pathId) {
  if (typeof window === 'undefined') return 0
  
  const progress = JSON.parse(localStorage.getItem('learning-progress') || '{}')
  const path = learningPaths[pathId]
  if (!path) return 0
  
  const completed = path.articles.filter(article => 
    progress[article.path]?.completed
  ).length
  
  return Math.round((completed / path.articles.length) * 100)
}

// 标记文章已完成
export function markArticleComplete(articlePath) {
  if (typeof window === 'undefined') return
  
  const progress = JSON.parse(localStorage.getItem('learning-progress') || '{}')
  progress[articlePath] = {
    completed: true,
    completedAt: Date.now()
  }
  localStorage.setItem('learning-progress', JSON.stringify(progress))
}

// 获取下一篇推荐文章
export function getNextRecommendation() {
  if (typeof window === 'undefined') return null
  
  const progress = JSON.parse(localStorage.getItem('learning-progress') || '{}')
  
  for (const pathId of recommendedOrder) {
    const path = learningPaths[pathId]
    for (const article of path.articles) {
      if (!progress[article.path]?.completed) {
        return {
          ...article,
          pathTitle: path.title,
          pathIcon: path.icon
        }
      }
    }
  }
  
  return null
}
