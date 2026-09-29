import { style } from '@vanilla-extract/css'
import { ease, space, text, weight } from './scale'
import { vars } from './tokens.css'

const transition = ['color', 'background-color', 'border-color', 'box-shadow']
    .map((property) => `${property} ${vars.duration} ${ease}`)
    .join(', ')

/** `<button class="nook-button" data-variant="primary | secondary | ghost" data-size="small" data-icon>` */
export const button = style(
    {
        boxSizing: 'border-box',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: space(2),
        minHeight: space(9),
        padding: `0 ${space(4)}`,
        border: '1px solid rgb(3 105 161 / 0.25)',
        borderRadius: vars.radius,
        color: vars.secondary,
        background: vars.secondarySoft,
        fontFamily: vars.font,
        ...text.sm,
        fontWeight: weight.medium,
        whiteSpace: 'nowrap',
        cursor: 'pointer',
        transition,
        selectors: {
            '&:hover': { borderColor: vars.secondary },

            "&[data-variant='primary']": {
                borderColor: 'transparent',
                color: vars.accentText,
                background: vars.accent
            },
            "&[data-variant='primary']:hover": { background: vars.accentStrong },

            "&[data-variant='ghost']": {
                borderColor: vars.border,
                color: vars.textMuted,
                background: 'transparent'
            },
            "&[data-variant='ghost']:hover": { color: vars.text, borderColor: vars.textMuted },

            "&[data-size='small']": { gap: space(1.5), minHeight: space(8), padding: `0 ${space(3)}`, ...text.xs },
            '&[data-icon]': { width: space(9), padding: 0 },
            "&[data-icon][data-size='small']": { width: space(8) },

            '&:focus-visible': { outline: `2px solid ${vars.focus}`, outlineOffset: 2 },
            // Set by Popover while its panel is open.
            '&[data-open]': { boxShadow: '0 0 0 3px rgb(56 189 248 / 0.35)' },
            '&:disabled': { cursor: 'not-allowed', opacity: 0.5 }
        },
        '@media': {
            '(forced-colors: active)': { borderColor: 'ButtonText' }
        }
    },
    'button'
)
