import type { NavbarConfig } from '@vuepress/theme-default'

export const navbarEn: NavbarConfig = [
  {
    text: 'Home',
    link: '/',
  },
  {
    text: 'Alert Rules',
    children: [
      '/alertrules/PrometheusSelfRules.md',
      '/alertrules/NodeExporterRules.md',
    ],
  },
  {
    text: 'noAlert',
    link: 'https://www.noalert.cloud',
  },
]