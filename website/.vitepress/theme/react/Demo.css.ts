import { globalStyle, style } from '@vanilla-extract/css'
import { vars } from '../theme.css'

/* The frame around every live demo: title bar, Preview / Code / CSS tabs, and the stage. */

export const demo = style({
    margin: '1.5rem 0',
    border: `1px solid ${vars.border}`,
    borderRadius: 14,
    overflow: 'hidden',
    background: vars.bg.base
})

// Author display rules would otherwise override the hidden attribute on tab panels.
globalStyle(`${demo} [role='tabpanel'][hidden]`, { display: 'none' })

export const bar = style({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '0.75rem',
    padding: '0.6rem 0.9rem',
    borderBottom: `1px solid ${vars.divider}`,
    background: vars.bg.alt
})

export const heading = style({
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    minWidth: 0
})

export const title = style({
    color: vars.text[2],
    fontSize: '0.74rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase'
})

export const badge = style({
    padding: '0.15rem 0.45rem',
    borderRadius: 5,
    color: vars.brand[1],
    background: vars.brand.soft,
    fontFamily: vars.font.mono,
    fontSize: '0.72rem'
})

export const tabs = style({
    display: 'inline-flex',
    gap: '0.15rem',
    padding: '0.15rem',
    border: `1px solid ${vars.border}`,
    borderRadius: 8,
    background: vars.bg.base
})

export const tab = style({
    padding: '0.2rem 0.6rem',
    border: 0,
    borderRadius: 6,
    color: vars.text[2],
    background: 'transparent',
    font: 'inherit',
    fontSize: '0.78rem',
    fontWeight: 600,
    cursor: 'pointer',
    selectors: {
        '&:hover': { color: vars.text[1] },
        "&[aria-selected='true']": { color: vars.brand[1], background: vars.brand.soft },
        '&:focus-visible': { outline: `2px solid ${vars.sky[400]}`, outlineOffset: 1 }
    }
})

// Code panels reuse VitePress code blocks (colors, copy button); only flatten them into the frame.
export const code = style({})

globalStyle(`${code} div[class*='language-']`, { margin: 0, borderRadius: 0 })

globalStyle(`${code} pre`, { maxHeight: 460, overflow: 'auto' })

export const stage = style({
    position: 'relative',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    minHeight: 220,
    padding: '2.5rem 1.5rem',
    backgroundColor: vars.bg.base,
    backgroundImage: [
        `radial-gradient(color-mix(in srgb, ${vars.sky[400]} 35%, transparent) 1px, transparent 1px)`,
        vars.surfaceGradient
    ].join(', '),
    backgroundSize: '16px 16px, 100% 100%'
})

export const hint = style({
    margin: 0,
    padding: '0.55rem 0.9rem',
    borderTop: `1px solid ${vars.divider}`,
    color: vars.text[3],
    background: vars.bg.alt,
    fontSize: '0.8rem',
    lineHeight: 1.5
})

export const unsupported = style({
    position: 'absolute',
    inset: 0,
    display: 'grid',
    placeItems: 'center',
    padding: '1.5rem',
    color: vars.text[2],
    background: `color-mix(in srgb, ${vars.bg.base} 90%, transparent)`,
    fontSize: '0.9rem',
    textAlign: 'center'
})
