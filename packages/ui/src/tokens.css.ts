import { createGlobalTheme, createGlobalThemeContract, globalStyle } from '@vanilla-extract/css'
import { duration, fontSans, radius, shadowLg, space } from './scale'

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
    font: fontSans,
    radius: radius.md,
    radiusLarge: radius.lg,
    offset: space(2),
    duration,

    accent: '#047857',
    accentStrong: '#065f46',
    accentText: '#fff',
    secondary: '#0369a1',
    secondarySoft: 'rgb(56 189 248 / 0.14)',
    focus: '#38bdf8',

    text: '#0f172a',
    textMuted: '#475569',
    surface: '#fff',
    border: '#e2e8f0',
    shadow: shadowLg,

    tooltip: {
        surface: '#0f172a',
        text: '#fff',
        delay: '300ms',
        hideDelay: '100ms'
    }
})

globalStyle(".dark, [data-theme='dark']", {
    vars: {
        [vars.secondary]: '#7dd3fc',
        [vars.secondarySoft]: 'rgb(56 189 248 / 0.16)',

        [vars.text]: '#f8fafc',
        [vars.textMuted]: '#94a3b8',
        [vars.surface]: '#0f172a',
        [vars.border]: '#334155',

        [vars.tooltip.surface]: '#f1f5f9',
        [vars.tooltip.text]: '#0f172a'
    }
})
