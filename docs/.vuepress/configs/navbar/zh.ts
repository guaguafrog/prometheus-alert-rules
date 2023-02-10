import type { NavbarConfig } from '@vuepress/theme-default'

export const navbarZh: NavbarConfig = [
  {
    text: '首页',
    link: '/zh/',
  },
  {
    text: '告警规则',
    children: [
      '/zh/alertrules/PrometheusSelfRules.md',
      '/zh/alertrules/NodeExporterRules.md',
    ],
  },
  {
    text: 'noAlert',
    link: 'https://www.noalert.cloud',
  },
]