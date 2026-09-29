import { createGlobalTheme, createGlobalThemeContract, globalStyle } from '@vanilla-extract/css'

/** Theme with these custom properties; add `.dark` or `data-theme="dark"` on an ancestor for dark mode. */
export const vars = createGlobalThemeContract({
    font: 'nook-font',
    radius: 'nook-radius',
    radiusLarge: 'nook-radius-large',
    offset: 'nook-offset',
    duration: 'nook-duration',

    accent: 'nook-accent',
    accentStrong: 'nook-accent-strong',
    accentText: 'nook-accent-text',
    secondary: 'nook-secondary',
    secondarySoft: 'nook-secondary-soft',
    focus: 'nook-focus',

    text: 'nook-text',
    textMuted: 'nook-text-muted',
    surface: 'nook-surface',
    border: 'nook-border',
    shadow: 'nook-shadow',

    tooltip: {
        surface: 'nook-tooltip-surface',
        text: 'nook-tooltip-text',
        delay: 'nook-tooltip-delay',
        hideDelay: 'nook-tooltip-hide-delay'
    }
})

createGlobalTheme(':root', vars, {
    font: "Avenir, 'Avenir Next', Inter, ui-sans-serif, system-ui, sans-serif",
    radius: '10px',
    radiusLarge: '14px',
    offset: '8px',
    duration: '160ms',

    accent: '#047857',
    accentStrong: '#065f46',
    accentText: '#fff',
    secondary: '#0369a1',
    secondarySoft: 'rgb(56 189 248 / 0.14)',
    focus: '#38bdf8',

    text: '#0b2a2f',
    textMuted: '#3d5c63',
    surface: '#fff',
    border: '#c7e3f1',
    shadow: '0 18px 50px rgb(11 42 47 / 0.16), 0 2px 6px rgb(11 42 47 / 0.06)',

    tooltip: {
        surface: '#0b2a2f',
        text: '#fff',
        delay: '300ms',
        hideDelay: '100ms'
    }
})

// Only what changes in dark mode.
globalStyle(".dark, [data-theme='dark']", {
    vars: {
        [vars.accentText]: '#fff',
        [vars.secondary]: '#7dd3fc',
        [vars.secondarySoft]: 'rgb(56 189 248 / 0.16)',

        [vars.text]: '#e7faf4',
        [vars.textMuted]: '#a8c9cf',
        [vars.surface]: '#0c262d',
        [vars.border]: '#1f4852',
        [vars.shadow]: '0 18px 50px rgb(0 0 0 / 0.5)',

        [vars.tooltip.surface]: '#d1fae5',
        [vars.tooltip.text]: '#0b2a2f'
    }
})
