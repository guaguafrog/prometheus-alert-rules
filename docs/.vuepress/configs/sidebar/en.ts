import type { SidebarConfig } from '@vuepress/theme-default'

export const sidebarEn: SidebarConfig = {
  '/alertrules/': [
    {
      text: 'Alert Rules',
      children: [
        '/alertrules/PrometheusSelfRules.md',
        '/alertrules/NodeExporterRules.md'
      ],
    },
  ]
}