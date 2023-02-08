import type { HeadConfig } from '@vuepress/core'

export const head: HeadConfig[] = [
  [
    'link',
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      href: `/images/icon.svg`,
    },
  ],
  ['link', { rel: 'manifest', href: '/manifest.webmanifest' }],
  ['meta', { name: 'application-name', content: 'Prometheus alert rules' }],
  ['meta', { name: 'apple-mobile-web-app-title', content: 'Prometheus alert rules' }],
  ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
  [
    'link',
    { rel: 'apple-touch-icon', href: `/images/icon.svg` },
  ],
  [
    'link',
    {
      rel: 'mask-icon',
      href: '/images/icon.svg',
      color: '#3eaf7c',
    },
  ],
  ['meta', { name: 'msapplication-TileColor', content: '#3eaf7c' }],
  ['meta', { name: 'theme-color', content: '#3eaf7c' }]
]