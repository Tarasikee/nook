import { createGlobalTheme, createGlobalThemeContract, globalStyle } from '@vanilla-extract/css'
import { duration, fontSans, radius, shadowLg, space } from './scale'

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

// Tailwind defaults (see scale.ts); colors are Tailwind's emerald, sky, and slate.
createGlobalTheme(':root', vars, {
    font: fontSans,
    radius: radius.md,
    radiusLarge: radius.lg,
    offset: space(2),
    duration,

    accent: '#047857', // emerald-700
    accentStrong: '#065f46', // emerald-800
    accentText: '#fff',
    secondary: '#0369a1', // sky-700
    secondarySoft: 'rgb(56 189 248 / 0.14)', // sky-400
    focus: '#38bdf8', // sky-400

    text: '#0f172a', // slate-900
    textMuted: '#475569', // slate-600
    surface: '#fff',
    border: '#e2e8f0', // slate-200
    shadow: shadowLg,

    tooltip: {
        surface: '#0f172a', // slate-900
        text: '#fff',
        delay: '300ms',
        hideDelay: '100ms'
    }
})

// Only what changes in dark mode.
globalStyle(".dark, [data-theme='dark']", {
    vars: {
        [vars.secondary]: '#7dd3fc', // sky-300
        [vars.secondarySoft]: 'rgb(56 189 248 / 0.16)',

        [vars.text]: '#f8fafc', // slate-50
        [vars.textMuted]: '#94a3b8', // slate-400
        [vars.surface]: '#0f172a', // slate-900
        [vars.border]: '#334155', // slate-700

        [vars.tooltip.surface]: '#f1f5f9', // slate-100
        [vars.tooltip.text]: '#0f172a'
    }
})
