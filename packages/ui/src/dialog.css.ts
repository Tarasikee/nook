import { globalStyle, style } from '@vanilla-extract/css'
import { containerLg, ease, space, text, trackingTight, weight } from './scale'
import { vars } from './tokens.css'

const closed = { opacity: 0, scale: '0.95' }

export const dialog = style(
    {
        boxSizing: 'border-box',
        width: `min(${containerLg}, calc(100vw - ${space(8)}))`,
        maxHeight: `calc(100vh - ${space(8)})`,
        padding: space(6),
        border: `1px solid ${vars.border}`,
        borderRadius: vars.radiusLarge,
        color: vars.text,
        background: vars.surface,
        boxShadow: vars.shadow,
        fontFamily: vars.font,
        ...text.sm,
        textAlign: 'start',
        ...closed,
        transition: [
            `opacity ${vars.duration} ${ease}`,
            `scale ${vars.duration} ${ease}`,
            `display ${vars.duration} allow-discrete`,
            `overlay ${vars.duration} allow-discrete`
        ].join(', '),
        selectors: {
            '&[open]': { opacity: 1, scale: '1', '@starting-style': closed }
        },
        '@media': {
            '(prefers-reduced-motion: reduce)': { transition: 'none' }
        }
    },
    'dialog'
)

globalStyle(`${dialog}::backdrop`, { background: 'rgb(0 0 0 / 0.5)' })

export const dialogTitle = style(
    { margin: `0 0 ${space(2)}`, ...text.lg, fontWeight: weight.semibold, letterSpacing: trackingTight },
    'dialog__title'
)
