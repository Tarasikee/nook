import type { ComponentType } from 'react'

export type PageDefinition = {
    path: string
    title: string
    description: string
    section: string
    group: string
    load: () => Promise<{ default: ComponentType }>
}

export const sections = [
    { name: 'Components', path: '/ui/' },
    { name: 'Guide', path: '/guide/' },
    { name: 'API', path: '/api/' },
    { name: 'Examples', path: '/examples/' }
]

export const pages: PageDefinition[] = [
    {
        path: '/',
        title: 'Nook',
        description: 'Native React components built on the browser. Copy the source, make it yours.',
        section: '',
        group: '',
        load: () => import('./pages/index')
    },
    {
        path: '/ui/',
        title: 'Components',
        description: "Ready-made components in Nook's design language, built on the primitives.",
        section: 'Components',
        group: 'Components',
        load: () => import('./pages/ui/index')
    },
    {
        path: '/ui/button',
        title: 'Button',
        description: "Nook's native button.",
        section: 'Components',
        group: 'Components',
        load: () => import('./pages/ui/button')
    },
    {
        path: '/ui/tooltip',
        title: 'Tooltip',
        description: "Nook's styled tooltip and tooltip group.",
        section: 'Components',
        group: 'Components',
        load: () => import('./pages/ui/tooltip')
    },
    {
        path: '/ui/popover',
        title: 'Popover',
        description: "Nook's styled popover.",
        section: 'Components',
        group: 'Components',
        load: () => import('./pages/ui/popover')
    },
    {
        path: '/ui/dialog',
        title: 'Dialog',
        description: "Nook's styled modal dialog.",
        section: 'Components',
        group: 'Components',
        load: () => import('./pages/ui/dialog')
    },
    {
        path: '/guide/',
        title: 'Introduction',
        description: 'What Nook is and where to find things.',
        section: 'Guide',
        group: 'Getting started',
        load: () => import('./pages/guide/index')
    },
    {
        path: '/guide/getting-started',
        title: 'Quick start',
        description: 'Install Nook hooks and build an anchored popover.',
        section: 'Guide',
        group: 'Getting started',
        load: () => import('./pages/guide/getting-started')
    },
    {
        path: '/guide/concepts',
        title: 'Concepts',
        description: "The ideas behind Nook's hooks.",
        section: 'Guide',
        group: 'Getting started',
        load: () => import('./pages/guide/concepts')
    },
    {
        path: '/guide/popover',
        title: 'Popover',
        description: 'Modes, controlled state, and opening from code with usePopover().',
        section: 'Guide',
        group: 'Primitives',
        load: () => import('./pages/guide/popover')
    },
    {
        path: '/guide/tooltip',
        title: 'Tooltip',
        description: 'Tooltips on native interest invokers, their delays, groups, and accessibility.',
        section: 'Guide',
        group: 'Primitives',
        load: () => import('./pages/guide/tooltip')
    },
    {
        path: '/guide/dialog',
        title: 'Dialog',
        description: 'Modal dialogs with the native dialog element and command buttons, without JavaScript.',
        section: 'Guide',
        group: 'Primitives',
        load: () => import('./pages/guide/dialog')
    },
    {
        path: '/guide/styling',
        title: 'Styling',
        description: 'Position and animate popovers and tooltips with CSS alone.',
        section: 'Guide',
        group: 'Guides',
        load: () => import('./pages/guide/styling')
    },
    {
        path: '/guide/accessibility',
        title: 'Accessibility',
        description: 'Who handles what, and what has been verified.',
        section: 'Guide',
        group: 'Guides',
        load: () => import('./pages/guide/accessibility')
    },
    {
        path: '/guide/browser-support',
        title: 'Browser support',
        description: 'What each hook needs, and what happens without it.',
        section: 'Guide',
        group: 'Guides',
        load: () => import('./pages/guide/browser-support')
    },
    {
        path: '/guide/performance',
        title: 'Performance',
        description: 'Nook measured against Radix and Floating UI on the same screen.',
        section: 'Guide',
        group: 'Guides',
        load: () => import('./pages/guide/performance')
    },
    {
        path: '/api/',
        title: 'API reference',
        description: 'Every option and return value of Nook hooks and local browser helpers.',
        section: 'API',
        group: 'API',
        load: () => import('./pages/api/index')
    },
    {
        path: '/examples/',
        title: 'Examples',
        description: 'Live patterns; each Code tab shows the exact source that runs it.',
        section: 'Examples',
        group: 'Examples',
        load: () => import('./pages/examples/index')
    }
]

const notFound: PageDefinition = {
    path: '/404',
    title: 'Page not found',
    description: 'This page does not exist.',
    section: '',
    group: 'Not found',
    load: () => import('./pages/not-found')
}

export function findPage(path: string): PageDefinition {
    return pages.find((page) => page.path.replace(/\/$/, '') === path.replace(/\/$/, '')) ?? notFound
}
