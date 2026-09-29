import { globalStyle, style, styleVariants } from '@vanilla-extract/css'
import { vars } from '../theme.css'
import { animated, panel } from './popover.css'

/* The home page hero: a small app window using the popover.css.ts patterns. */

export const hero = style({
    position: 'relative',
    isolation: 'isolate',
    '::before': {
        content: "''",
        position: 'absolute',
        inset: '-12% 0 -18% 0',
        zIndex: -1,
        background: [
            'radial-gradient(closest-side, rgb(56 189 248 / 0.24), transparent)',
            'radial-gradient(closest-side at 80% 20%, rgb(16 185 129 / 0.22), transparent)'
        ].join(', '),
        filter: 'blur(8px)'
    }
})

export const appWindow = style({
    position: 'relative',
    overflow: 'hidden',
    border: `1px solid ${vars.border}`,
    borderRadius: 18,
    background: vars.bg.base,
    boxShadow: '0 30px 80px rgb(11 42 47 / 0.14), 0 2px 8px rgb(11 42 47 / 0.05)',
    selectors: {
        '.dark &': { boxShadow: '0 30px 80px rgb(0 0 0 / 0.5)' }
    }
})

export const chrome = style({
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.7rem 0.9rem',
    borderBottom: `1px solid ${vars.divider}`,
    background: vars.bg.alt
})

// Window buttons and the address.
globalStyle(`${chrome} span`, {
    width: '0.62rem',
    height: '0.62rem',
    borderRadius: '50%',
    background: vars.border
})

globalStyle(`${chrome} p`, {
    flex: '1',
    margin: '0 2.2rem 0 0',
    color: vars.text[3],
    fontFamily: vars.font.mono,
    fontSize: '0.72rem',
    textAlign: 'center'
})

export const body = style({ padding: '1.4rem 1.4rem 1.2rem' })

export const header = style({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: '1rem'
})

export const crumb = style({
    margin: 0,
    color: vars.skyText,
    fontFamily: vars.font.mono,
    fontSize: '0.7rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase'
})

export const title = style({
    margin: '0.2rem 0 0',
    color: vars.text[1],
    fontSize: '1.3rem',
    fontWeight: 800,
    letterSpacing: '-0.03em'
})

export const actions = style({ display: 'flex', gap: '0.4rem' })

export const rows = style({
    display: 'grid',
    gap: '0.55rem',
    margin: '1.3rem 0 0',
    padding: 0,
    listStyle: 'none'
})

globalStyle(`${rows} li`, {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    padding: '0.75rem 0.85rem',
    border: `1px solid ${vars.divider}`,
    borderRadius: 11
})

/** A placeholder text bar; `--w` sets its width per row. */
export const bar = style({
    width: 'var(--w)',
    height: '0.55rem',
    borderRadius: 999,
    background: `linear-gradient(90deg, ${vars.bg.soft}, color-mix(in srgb, ${vars.sky[200]} 50%, transparent))`
})

const statusBase = style({
    padding: '0.15rem 0.5rem',
    borderRadius: 999,
    fontSize: '0.66rem',
    fontWeight: 700
})

export const status = styleVariants({
    pending: [statusBase, { color: vars.skyText, background: 'rgb(56 189 248 / 0.14)' }],
    done: [statusBase, { color: vars.brand[1], background: 'rgb(16 185 129 / 0.14)' }]
})

export const footer = style({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '0.4rem 1.2rem',
    padding: '0.6rem 1.4rem',
    borderTop: `1px solid ${vars.divider}`,
    color: vars.text[3],
    background: vars.bg.alt,
    fontFamily: vars.font.mono,
    fontSize: '0.7rem'
})

export const last = style({ marginLeft: 'auto', color: vars.brand[1] })

export const unsupported = style({
    position: 'absolute',
    inset: 0,
    display: 'grid',
    placeItems: 'center',
    padding: '2rem',
    color: vars.text[2],
    background: `color-mix(in srgb, ${vars.bg.base} 90%, transparent)`,
    textAlign: 'center'
})

/** The share panel: narrower, and aligned to the Share button's end. */
export const sharePanel = style([
    panel,
    animated,
    {
        width: 'min(300px, calc(100vw - 2rem))',
        '@supports': {
            '(position-area: block-end)': { positionArea: 'block-end span-inline-start' }
        }
    }
])

export const people = style({
    display: 'grid',
    gap: '0.55rem',
    margin: '0.8rem 0 0',
    padding: 0,
    listStyle: 'none'
})

globalStyle(`${people} li`, {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    margin: 0,
    fontSize: '0.82rem'
})

/** `--hue` sets the colors per person. */
export const avatar = style({
    display: 'grid',
    placeItems: 'center',
    width: '1.8rem',
    height: '1.8rem',
    borderRadius: '50%',
    color: 'hsl(var(--hue) 70% 28%)',
    background: 'hsl(var(--hue) 75% 90%)',
    fontSize: '0.64rem',
    fontWeight: 800
})

export const name = style({ flex: '1', color: vars.text[1], fontWeight: 600 })

export const role = style({ color: vars.text[3], fontSize: '0.74rem' })
