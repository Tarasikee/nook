import { fileURLToPath, URL } from 'node:url'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import { defineConfig, postcssIsolateStyles, type DefaultTheme } from 'vitepress'
import { nookIdentifier } from '../../packages/ui/identifiers'
import { sourcePlugin } from './source-plugin'

const repository = 'https://github.com/Tarasikee/nook'

/** A path inside `packages/`. */
const source = (path: string) => fileURLToPath(new URL(`../../packages/${path}`, import.meta.url))

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
            { text: 'Dialog', link: '/guide/dialog' },
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
        text: 'Nook UI',
        items: [
            { text: 'Overview', link: '/ui/' },
            { text: 'Button', link: '/ui/button' },
            { text: 'Tooltip', link: '/ui/tooltip' },
            { text: 'Popover', link: '/ui/popover' },
            { text: 'Dialog', link: '/ui/dialog' }
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
    // Playwright's dev server passes its own, so a test run never rewrites the dependency cache
    // under a running `pnpm dev` (that serves two copies of Vue and breaks every demo).
    cacheDir: process.env.NOOK_CACHE_DIR,
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
            { text: 'Nook UI', link: '/ui/', activeMatch: '^/ui/' },
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
            '/examples/': sidebar,
            '/ui/': sidebar
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
        plugins: [
            sourcePlugin(),
            vanillaExtractPlugin({
                // @nook/ui keeps the class names it ships (nook-button); the site's own stay short
                // hashes, prefixed like vanilla-extract's default when they start with a digit.
                identifiers: ({ hash, ...params }) =>
                    params.filePath.includes('packages/ui/src/') ? nookIdentifier(params) : hash.replace(/^(?=\d)/, '_')
            })
        ],
        css: {
            // Markdown styles (.vp-doc h2, p, code…) skip elements inside .vp-raw, such as demo previews.
            postcss: { plugins: [postcssIsolateStyles({ includeFiles: [/vp-doc\.css/] })] }
        },
        optimizeDeps: {
            // Demos load React lazily and recipes compile to this runtime, so the dev server's scan
            // misses them; finding them later re-optimizes and reloads pages mid-load.
            include: ['react', 'react/jsx-dev-runtime', 'react-dom/client', '@vanilla-extract/recipes/createRuntimeFn']
        },
        resolve: {
            // Workspace packages from source. `@nook/ui/nook.css` resolves to `src/nook.css.ts`.
            alias: [
                { find: '@nook/core', replacement: source('core/src/index.ts') },
                { find: '@nook/react', replacement: source('react/src/index.ts') },
                { find: '@nook/ui-react', replacement: source('ui-react/src/index.ts') },
                { find: /^@nook\/ui$/, replacement: source('ui/src/nook.css.ts') },
                { find: '@nook/ui', replacement: source('ui/src') }
            ]
        }
    }
})
