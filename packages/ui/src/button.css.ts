import { style } from '@vanilla-extract/css'
import { vars } from './tokens.css'

/** `<button class="nook-button" data-variant="primary | secondary | ghost" data-size="small" data-icon>` */
export const button = style(
    {
        boxSizing: 'border-box',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.45em',
        minHeight: '2.25rem',
        padding: '0 0.9rem',
        border: '1px solid rgb(3 105 161 / 0.25)',
        borderRadius: vars.radius,
        color: vars.secondary,
        background: vars.secondarySoft,
        font: `600 0.875rem/1 ${vars.font}`,
        cursor: 'pointer',
        transition: 'background-color 0.15s, border-color 0.15s, box-shadow 0.15s',
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

            "&[data-size='small']": { minHeight: '1.875rem', padding: '0 0.65rem', fontSize: '0.8125rem' },
            '&[data-icon]': { width: '2.25rem', padding: 0 },
            "&[data-icon][data-size='small']": { width: '1.875rem' },

            '&:focus-visible': { outline: `2px solid ${vars.focus}`, outlineOffset: 2 },
            // Set by Popover while its panel is open.
            '&[data-open]': { boxShadow: '0 0 0 3px rgb(56 189 248 / 0.35)' },
            '&:disabled': { cursor: 'not-allowed', opacity: 0.55 }
        },
        '@media': {
            '(forced-colors: active)': { borderColor: 'ButtonText' }
        }
    },
    'button'
)
