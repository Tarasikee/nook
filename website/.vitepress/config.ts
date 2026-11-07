import { fileURLToPath, URL } from 'node:url'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, postcssIsolateStyles, type DefaultTheme } from 'vitepress'
import { sourcePlugin } from './source-plugin'

const repository = 'https://github.com/Tarasikee/nook'

/** A path inside `packages/`. */
const source = (path: string) => fileURLToPath(new URL(`../../packages/${path}`, import.meta.url))

const guideSidebar: DefaultTheme.SidebarItem[] = [
    {
        text: 'Getting started',
        items: [
            { text: 'Introduction', link: '/guide/' },
            { text: 'Quick start', link: '/guide/getting-started' },
            { text: 'Core concepts', link: '/guide/concepts' }
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
    }
]

const nookSidebar: DefaultTheme.SidebarItem[] = [
    {
        text: 'Primitives',
        items: [
            { text: 'Popover', link: '/guide/popover' },
            { text: 'Tooltip', link: '/guide/tooltip' },
            { text: 'Dialog', link: '/guide/dialog' },
            { text: 'Menu <span class="nk-soon">planned</span>', link: '/guide/#status-and-roadmap' },
            { text: 'Select <span class="nk-soon">planned</span>', link: '/guide/#status-and-roadmap' }
        ]
    }
]

const uiSidebar: DefaultTheme.SidebarItem[] = [
    {
        text: 'Nook UI',
        items: [
            { text: 'Overview', link: '/ui/' },
            { text: 'Button', link: '/ui/button' },
            { text: 'Tooltip', link: '/ui/tooltip' },
            { text: 'Popover', link: '/ui/popover' },
            { text: 'Dialog', link: '/ui/dialog' }
        ]
    }
]

const apiSidebar: DefaultTheme.SidebarItem[] = [
    {
        text: 'API',
        items: [
            { text: 'Overview', link: '/api/' },
            { text: 'usePopover', link: '/api/#usepopover' },
            { text: 'useTooltip', link: '/api/#usetooltip' },
            { text: 'Core', link: '/api/#core' }
        ]
    }
]

const examplesSidebar: DefaultTheme.SidebarItem[] = [
    {
        text: 'Examples',
        items: [
            { text: 'Overview', link: '/examples/' },
            { text: 'Share popover', link: '/examples/#share-popover' },
            { text: 'Toolbar tooltips with a group', link: '/examples/#toolbar-tooltips-with-a-group' },
            { text: 'Tooltip and popover on one button', link: '/examples/#tooltip-and-popover-on-one-button' },
            { text: 'Controlled manual panel', link: '/examples/#controlled-manual-panel' },
            { text: 'Placement playground', link: '/examples/#placement-playground' },
            { text: 'Animated popover', link: '/examples/#animated-popover' }
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
            {
                text: 'Guide',
                link: '/guide/',
                activeMatch: '^/guide/(?!popover(?:$|[.#/])|tooltip(?:$|[.#/])|dialog(?:$|[.#/]))'
            },
            { text: 'Nook', link: '/guide/popover', activeMatch: '^/guide/(popover|tooltip|dialog)(?:$|[.#/])' },
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
            // Equal-depth matches keep insertion order; primitive pages precede the Guide fallback.
            '/guide/popover': nookSidebar,
            '/guide/tooltip': nookSidebar,
            '/guide/dialog': nookSidebar,
            '/guide/': guideSidebar,
            '/api/': apiSidebar,
            '/examples/': examplesSidebar,
            '/ui/': uiSidebar
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
            tailwindcss(),
            sourcePlugin(),
            vanillaExtractPlugin({
                identifiers: ({ hash }) => hash.replace(/^(?=\d)/, '_')
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
            alias: [
                { find: '@nook/ui/hooks', replacement: source('ui/src/hooks.ts') },
                { find: /^@nook\/ui$/, replacement: source('ui/src/index.ts') },
                { find: '@nook/ui', replacement: source('ui/src') }
            ]
        }
    }
})
