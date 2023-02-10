import type { SidebarConfig } from '@vuepress/theme-default'

export const sidebarZh: SidebarConfig = {
  '/zh/alertrules/': [
    {
      text: '告警规则',
      children: [
        '/zh/alertrules/PrometheusSelfRules.md',
        '/zh/alertrules/NodeExporterRules.md',
      ],
    },
  ]
}