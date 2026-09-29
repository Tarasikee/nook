import { fileURLToPath, URL } from 'node:url'
import { defineConfig, type DefaultTheme } from 'vitepress'
import { sourcePlugin } from './source-plugin'

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
            { text: 'Menu <span class="nk-soon">planned</span>', link: '/guide/#status-and-roadmap' },
            { text: 'Select <span class="nk-soon">planned</span>', link: '/guide/#status-and-roadmap' }
        ]
    },
    {
        text: 'Guides',
        items: [
            { text: 'Styling', link: '/guide/styling' },
            { text: 'Accessibility', link: '/guide/accessibility' },
            { text: 'Browser support', link: '/guide/browser-support' },
            { text: 'Performance', link: '/guide/performance' }
        ]
    },
    {
        text: 'Reference',
        items: [
            { text: 'API', link: '/api/' },
            { text: 'Examples', link: '/examples/' }
        ]
    }
]

export default defineConfig({
    title: 'Nook',
    titleTemplate: ':title · Nook',
    description:
        'Accessible, headless React primitives built on native HTML: popovers and tooltips with no positioning JavaScript.',
    lang: 'en-US',
    cleanUrls: true,
    srcExclude: ['tests/**'],
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
                    { text: 'Roadmap', link: '/guide/#status-and-roadmap' },
                    { text: 'Browser support', link: '/guide/browser-support' },
                    { text: 'Contributing', link: `${repository}#develop` }
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
        plugins: [sourcePlugin()],
        resolve: {
            alias: {
                '@nook/core': fileURLToPath(new URL('../../packages/core/src/index.ts', import.meta.url)),
                '@nook/react': fileURLToPath(new URL('../../packages/react/src/index.ts', import.meta.url))
            }
        }
    }
})
