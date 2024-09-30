import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Kùzu Wasm",
  description: "WebAssembly version of Kùzu database",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/what-is-kuzu-wasm', activeMatch: '/guide/' },
    ],

    sidebar: {
      '/guide/': [
        {
          base: '/guide/',
          items: [
            {
              text: 'Introduction',
              collapsed: false,
              items: [
                { text: 'What is Kuzu Wasm?', link: 'what-is-kuzu-wasm' },
                { text: 'Prerequisite', link: 'prerequisite' },
                { text: 'Getting Started', link: 'getting-started' },
              ]
            },
            {
              text: 'Import data',
              collapsed: false,
              items: [
                { text: 'Updating...', link: '' },
              ]
            }
          ]
        }
      ]
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present Dylan Shang'
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/unswdb/kuzu-wasm' }
    ]
  }
})
