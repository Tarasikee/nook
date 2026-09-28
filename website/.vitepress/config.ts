import { fileURLToPath, URL } from 'node:url'
import { defineConfig, type DefaultTheme } from 'vitepress'

const repository = 'https://github.com/Tarasikee/nook'

const sidebar: DefaultTheme.SidebarItem[] = [
    {
        text: 'Getting started',
        items: [
            { text: 'Introduction', link: '/guide/' },
            { text: 'Quick start', link: '/guide/getting-started' },
            { text: 'Core concepts', link: '/guide/concepts' }
        ]
    },
    {
        text: 'Primitives',
        items: [
            { text: 'Popover', link: '/guide/popover' },
            { text: 'Tooltip', link: '/guide/tooltip' },
            { text: 'Menu <span class="nk-soon">planned</span>', link: '/guide/roadmap#menu' },
            { text: 'Select <span class="nk-soon">planned</span>', link: '/guide/roadmap#select' }
        ]
    },
    {
        text: 'Styling',
        items: [
            { text: 'Positioning', link: '/guide/positioning' },
            { text: 'Animation', link: '/guide/animation' }
        ]
    },
    {
        text: 'Guides',
        items: [
            { text: 'Accessibility', link: '/guide/accessibility' },
            { text: 'Server rendering', link: '/guide/server-rendering' },
            { text: 'Quality and React rules', link: '/guide/quality' },
            { text: 'Browser support', link: '/guide/browser-support' },
            { text: 'Roadmap', link: '/guide/roadmap' }
        ]
    },
    {
        text: 'API reference',
        items: [
            { text: 'Overview', link: '/api/' },
            { text: 'usePopover', link: '/api/use-popover' },
            { text: 'useTooltip', link: '/api/use-tooltip' },
            { text: 'Core helpers', link: '/api/core' }
        ]
    },
    {
        text: 'Examples',
        items: [{ text: 'Gallery', link: '/examples/' }]
    }
]

export default defineConfig({
    title: 'Nook',
    titleTemplate: ':title · Nook',
    description: 'Accessible, headless React primitives built on native HTML: popovers and tooltips with no positioning JavaScript.',
    lang: 'en-US',
    cleanUrls: true,
    srcExclude: ['README.md', 'tests/**'],
    head: [
        ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
        ['meta', { name: 'theme-color', content: '#047857' }],
        ['meta', { property: 'og:type', content: 'website' }],
        ['meta', { property: 'og:title', content: 'Nook — accessible primitives on native HTML' }],
        [
            'meta',
            {
                property: 'og:description',
                content: 'Headless React hooks for popovers and tooltips, built on popovertarget and interestfor.'
            }
        ]
    ],
    markdown: {
        theme: { light: 'github-light', dark: 'github-dark' }
    },
    themeConfig: {
        logo: { src: '/logo.svg', width: 24, height: 24 },
        nav: [
            { text: 'Guide', link: '/guide/', activeMatch: '^/guide/' },
            { text: 'API', link: '/api/', activeMatch: '^/api/' },
            { text: 'Examples', link: '/examples/', activeMatch: '^/examples/' },
            {
                text: '0.0.0',
                items: [
                    { text: 'Roadmap', link: '/guide/roadmap' },
                    { text: 'Browser support', link: '/guide/browser-support' },
                    { text: 'Contributing', link: `${repository}/blob/main/CONTRIBUTING.md` }
                ]
            }
        ],
        sidebar: {
            '/guide/': sidebar,
            '/api/': sidebar,
            '/examples/': sidebar
        },
        outline: { level: [2, 3], label: 'On this page' },
        search: { provider: 'local' },
        socialLinks: [{ icon: 'github', link: repository }],
        editLink: {
            pattern: `${repository}/edit/main/website/:path`,
            text: 'Edit this page on GitHub'
        },
        docFooter: { prev: 'Previous', next: 'Next' },
        footer: {
            message: 'Released under the MIT License.',
            copyright: 'Copyright © Nook contributors'
        }
    },
    vite: {
        esbuild: { jsx: 'automatic', jsxImportSource: 'react' },
        resolve: {
            alias: {
                '@nook/core': fileURLToPath(new URL('../../packages/core/src/index.ts', import.meta.url)),
                '@nook/react': fileURLToPath(new URL('../../packages/react/src/index.ts', import.meta.url))
            }
        }
    }
})
