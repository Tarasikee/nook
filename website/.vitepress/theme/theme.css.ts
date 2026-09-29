import { createGlobalTheme, createGlobalThemeContract, globalStyle } from '@vanilla-extract/css'

/**
 * Site theme: Nook's brand on top of VitePress (green, light blue, and white).
 *
 * `vars` types every token for `.css.ts` files. The tokens keep their CSS names (--vp-*, --nk-*),
 * so Vue <style> blocks and Markdown use the same values. Text-bearing greens have at least
 * 4.5:1 contrast on white (#047857 on #fff is about 5.5:1).
 */
export const vars = createGlobalThemeContract({
    font: { base: 'vp-font-family-base', mono: 'vp-font-family-mono' },
    green: {
        50: 'nk-green-50',
        100: 'nk-green-100',
        300: 'nk-green-300',
        500: 'nk-green-500',
        600: 'nk-green-600',
        700: 'nk-green-700',
        800: 'nk-green-800'
    },
    sky: { 50: 'nk-sky-50', 100: 'nk-sky-100', 200: 'nk-sky-200', 400: 'nk-sky-400', 600: 'nk-sky-600' },
    ink: 'nk-ink',

    skyText: 'nk-sky-text',
    accentGradient: 'nk-accent-gradient',
    surfaceGradient: 'nk-surface-gradient',
    popoverShadow: 'nk-popover-shadow',
    tooltip: { bg: 'nk-tooltip-bg', text: 'nk-tooltip-text' },

    brand: { 1: 'vp-c-brand-1', 2: 'vp-c-brand-2', 3: 'vp-c-brand-3', soft: 'vp-c-brand-soft' },
    bg: { base: 'vp-c-bg', alt: 'vp-c-bg-alt', soft: 'vp-c-bg-soft', elv: 'vp-c-bg-elv' },
    text: { 1: 'vp-c-text-1', 2: 'vp-c-text-2', 3: 'vp-c-text-3' },
    divider: 'vp-c-divider',
    gutter: 'vp-c-gutter',
    border: 'vp-c-border',

    code: {
        color: 'vp-code-color',
        bg: 'vp-code-bg',
        blockBg: 'vp-code-block-bg',
        tabBg: 'vp-code-tab-bg',
        tabDivider: 'vp-code-tab-divider',
        copyBg: 'vp-code-copy-code-bg'
    },
    button: {
        brandBg: 'vp-button-brand-bg',
        brandHoverBg: 'vp-button-brand-hover-bg',
        brandActiveBg: 'vp-button-brand-active-bg'
    },
    customBlock: {
        tipBg: 'vp-custom-block-tip-bg',
        tipBorder: 'vp-custom-block-tip-border',
        tipText: 'vp-custom-block-tip-text',
        infoBg: 'vp-custom-block-info-bg',
        infoBorder: 'vp-custom-block-info-border'
    },
    navLogoHeight: 'vp-nav-logo-height',
    layoutMaxWidth: 'vp-layout-max-width'
})

createGlobalTheme(':root', vars, {
    font: {
        base: "Avenir, 'Avenir Next', 'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
        mono: "'DM Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
    },
    green: {
        50: '#ecfdf5',
        100: '#d1fae5',
        300: '#6ee7b7',
        500: '#10b981',
        600: '#059669',
        700: '#047857',
        800: '#065f46'
    },
    sky: { 50: '#f0f9ff', 100: '#e0f2fe', 200: '#bae6fd', 400: '#38bdf8', 600: '#0284c7' },
    ink: '#0b2a2f',

    skyText: vars.sky[600],
    accentGradient: `linear-gradient(100deg, ${vars.green[600]} 0%, #0ea5a4 45%, ${vars.sky[600]} 100%)`,
    surfaceGradient: `linear-gradient(160deg, ${vars.sky[50]} 0%, #ffffff 45%, ${vars.green[50]} 100%)`,
    popoverShadow: '0 18px 50px rgb(11 42 47 / 0.16), 0 2px 6px rgb(11 42 47 / 0.06)',
    tooltip: { bg: vars.ink, text: '#fff' },

    brand: { 1: vars.green[700], 2: vars.green[800], 3: vars.green[600], soft: 'rgba(16, 185, 129, 0.14)' },
    bg: { base: '#ffffff', alt: vars.sky[50], soft: '#e8f5fd', elv: '#ffffff' },
    text: { 1: vars.ink, 2: '#3d5c63', 3: '#6b8a91' },
    divider: '#d6ebf5',
    gutter: '#e3f1f9',
    border: '#c7e3f1',

    code: {
        color: vars.green[700],
        bg: 'rgba(16, 185, 129, 0.1)',
        blockBg: '#f4fafe',
        tabBg: '#eaf5fc',
        tabDivider: '#d6ebf5',
        copyBg: '#ffffff'
    },
    button: { brandBg: vars.green[700], brandHoverBg: vars.green[800], brandActiveBg: '#064e3b' },
    customBlock: {
        tipBg: 'rgba(16, 185, 129, 0.08)',
        tipBorder: 'transparent',
        tipText: vars.text[1],
        infoBg: 'rgba(56, 189, 248, 0.1)',
        infoBorder: 'transparent'
    },
    navLogoHeight: '26px',
    layoutMaxWidth: '1380px'
})

// Only what changes in dark mode; everything else keeps its :root value.
globalStyle('.dark', {
    vars: {
        [vars.skyText]: '#7dd3fc',
        [vars.accentGradient]: `linear-gradient(100deg, ${vars.green[300]} 0%, #5eead4 45%, #7dd3fc 100%)`,
        [vars.surfaceGradient]: 'linear-gradient(160deg, #0b2530 0%, #071b20 50%, #082a22 100%)',
        [vars.popoverShadow]: '0 18px 50px rgb(0 0 0 / 0.5)',
        [vars.tooltip.bg]: vars.green[100],
        [vars.tooltip.text]: vars.ink,

        [vars.brand[1]]: '#34d399',
        [vars.brand[2]]: '#6ee7b7',
        [vars.brand[3]]: vars.green[600],
        [vars.brand.soft]: 'rgba(52, 211, 153, 0.16)',

        [vars.bg.base]: '#071b20',
        [vars.bg.alt]: '#0a232a',
        [vars.bg.soft]: '#0e2d35',
        [vars.bg.elv]: '#0c262d',
        [vars.text[1]]: '#e7faf4',
        [vars.text[2]]: '#a8c9cf',
        [vars.text[3]]: '#749aa1',
        [vars.divider]: '#173b44',
        [vars.gutter]: '#051418',
        [vars.border]: '#1f4852',

        [vars.code.color]: '#6ee7b7',
        [vars.code.bg]: 'rgba(52, 211, 153, 0.12)',
        [vars.code.blockBg]: '#0a2329',
        [vars.code.tabBg]: '#081e24',
        [vars.code.tabDivider]: '#173b44',
        [vars.code.copyBg]: '#0e2d35',

        [vars.button.brandBg]: vars.green[700],
        [vars.button.brandHoverBg]: vars.green[600],

        [vars.customBlock.infoBg]: 'rgba(56, 189, 248, 0.08)'
    }
})

globalStyle('.VPNavBarTitle .title', {
    fontWeight: 800,
    letterSpacing: '0.08em',
    textTransform: 'uppercase'
})

// <span class="nk-soon">planned</span> in sidebar items (config.ts).
globalStyle('.nk-soon', {
    marginLeft: '0.35rem',
    padding: '0.05rem 0.4rem',
    borderRadius: 999,
    color: vars.text[3],
    background: vars.bg.soft,
    fontSize: '0.68rem',
    fontWeight: 600,
    letterSpacing: '0.02em',
    verticalAlign: '0.08em'
})

// Markdown pages

globalStyle('.vp-doc h1', { fontWeight: 800, letterSpacing: '-0.04em' })

globalStyle('.vp-doc h2', { fontWeight: 750, letterSpacing: '-0.03em', borderTopColor: vars.divider })

globalStyle('.vp-doc h3', { letterSpacing: '-0.02em' })

globalStyle('.vp-doc :is(h2, h3) > code', { fontSize: '0.92em' })

// <p class="nk-lead"> under a page title.
globalStyle('.vp-doc .nk-lead', {
    marginTop: '0.5rem',
    color: vars.text[2],
    fontSize: '1.12rem',
    lineHeight: 1.7
})

// <span class="nk-pill"> next to a heading.
globalStyle('.vp-doc .nk-pill', {
    display: 'inline-block',
    padding: '0.1rem 0.5rem',
    borderRadius: 999,
    color: vars.skyText,
    background: 'rgba(56, 189, 248, 0.14)',
    fontSize: '0.75rem',
    fontWeight: 700,
    // Inside a heading, don't inherit its tall line-height or tight tracking.
    lineHeight: 1.6,
    letterSpacing: 0,
    verticalAlign: 'middle'
})

// Keep VitePress's scrollable tables on small screens; stretch them on wider ones.
globalStyle('.vp-doc table', {
    '@media': { '(min-width: 768px)': { display: 'table', width: '100%' } }
})

globalStyle('.vp-doc table th', {
    fontSize: '0.78rem',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    color: vars.text[2]
})

globalStyle('.vp-doc tr:nth-child(2n)', {
    backgroundColor: `color-mix(in srgb, ${vars.bg.alt} 60%, transparent)`
})
