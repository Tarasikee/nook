import { globalStyle, style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { vars } from '../theme.css'

/*
 * Demo furniture: buttons, chips, a toolbar, and state readouts. Page styling for the examples,
 * not part of any Nook pattern; the pattern's styles are popover.css.ts.
 */

const focusRing = style({
    selectors: {
        '&:focus-visible': { outline: `2px solid ${vars.sky[400]}`, outlineOffset: 2 }
    }
})

/** A trigger whose popover is open gets `data-open`. */
const trigger = style({
    selectors: {
        '&[data-open]': { boxShadow: '0 0 0 3px rgb(56 189 248 / 0.35)' }
    }
})

export const button = recipe({
    base: [
        focusRing,
        trigger,
        {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.45rem',
            minHeight: '2.35rem',
            padding: '0 0.95rem',
            border: '1px solid transparent',
            borderRadius: 9,
            font: 'inherit',
            fontSize: '0.875rem',
            fontWeight: 650,
            lineHeight: 1,
            cursor: 'pointer',
            transition: 'background-color 0.15s, border-color 0.15s, box-shadow 0.15s'
        }
    ],
    variants: {
        variant: {
            primary: {
                color: '#fff',
                background: vars.green[700],
                boxShadow: '0 6px 16px rgb(4 120 87 / 0.22)',
                selectors: { '&:hover': { background: vars.green[800] } }
            },
            secondary: {
                color: vars.skyText,
                background: 'rgb(56 189 248 / 0.12)',
                borderColor: 'rgb(2 132 199 / 0.25)',
                selectors: { '&:hover': { borderColor: vars.sky[600] } }
            },
            ghost: {
                color: vars.text[2],
                background: vars.bg.base,
                borderColor: vars.border,
                selectors: { '&:hover': { color: vars.text[1], borderColor: vars.text[3] } }
            }
        },
        size: {
            medium: {},
            small: { minHeight: '1.9rem', padding: '0 0.65rem', fontSize: '0.78rem' }
        }
    },
    defaultVariants: { variant: 'secondary', size: 'medium' }
})

export const iconButton = style([
    focusRing,
    trigger,
    {
        display: 'inline-grid',
        placeItems: 'center',
        width: '2.35rem',
        height: '2.35rem',
        padding: 0,
        border: `1px solid ${vars.border}`,
        borderRadius: 9,
        color: vars.text[2],
        background: vars.bg.base,
        cursor: 'pointer',
        transition: 'color 0.15s, background-color 0.15s, border-color 0.15s',
        selectors: {
            '&:hover': { color: vars.brand[1], borderColor: vars.brand[3], background: vars.brand.soft },
            "&[aria-pressed='true']": { color: '#fff', background: vars.green[700], borderColor: vars.green[700] }
        }
    }
])

export const chip = style([
    focusRing,
    {
        padding: '0.35rem 0.7rem',
        border: `1px solid ${vars.border}`,
        borderRadius: 999,
        color: vars.text[2],
        background: vars.bg.base,
        font: 'inherit',
        fontFamily: vars.font.mono,
        fontSize: '0.76rem',
        cursor: 'pointer',
        selectors: {
            "&[aria-pressed='true']": { color: vars.brand[1], background: vars.brand.soft, borderColor: vars.brand[3] }
        }
    }
])

export const toolbar = style({
    display: 'inline-flex',
    gap: '0.25rem',
    padding: '0.3rem',
    border: `1px solid ${vars.border}`,
    borderRadius: 12,
    background: vars.bg.base,
    boxShadow: '0 8px 24px rgb(11 42 47 / 0.08)'
})

// Borderless buttons inside the toolbar, pressed or not.
globalStyle(`${toolbar} ${iconButton}, ${toolbar} ${iconButton}:hover`, { borderColor: 'transparent' })

export const row = style({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '0.4rem'
})

export const log = style({
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem',
    minWidth: '13rem',
    margin: 0,
    padding: '0.6rem 0.75rem',
    border: `1px dashed ${vars.border}`,
    borderRadius: 9,
    color: vars.text[2],
    background: vars.bg.base,
    fontFamily: vars.font.mono,
    fontSize: '0.74rem',
    lineHeight: 1.5,
    listStyle: 'none'
})

export const logEmpty = style({ color: vars.text[3] })

export const logOpen = style({ color: vars.brand[1] })

/** Open-state readout with a status dot. */
export const state = style({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    color: vars.text[2],
    fontFamily: vars.font.mono,
    fontSize: '0.76rem',
    '::before': {
        content: "''",
        width: '0.5rem',
        height: '0.5rem',
        borderRadius: '50%',
        background: vars.text[3]
    },
    selectors: {
        '&[data-open]::before': { background: vars.green[500], boxShadow: '0 0 0 3px rgb(16 185 129 / 0.25)' }
    }
})

/** Read-only input with an inline action. */
export const field = style({
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    marginTop: '0.8rem',
    padding: '0.25rem 0.25rem 0.25rem 0.6rem',
    border: `1px solid ${vars.border}`,
    borderRadius: 9,
    background: vars.bg.alt
})

globalStyle(`${field} input`, {
    flex: '1',
    minWidth: 0,
    border: 0,
    outline: 0,
    color: vars.text[2],
    background: 'transparent',
    fontFamily: vars.font.mono,
    fontSize: '0.76rem'
})

export const srOnly = style({
    position: 'absolute',
    width: 1,
    height: 1,
    overflow: 'hidden',
    clip: 'rect(0 0 0 0)',
    whiteSpace: 'nowrap'
})
