import { style } from '@vanilla-extract/css'
import { anchored } from './anchored'
import { space, text, trackingTight, weight } from './scale'
import { vars } from './tokens.css'

export const popover = style(
    [
        {
            boxSizing: 'border-box',
            width: `min(${space(72)}, calc(100vw - ${space(8)}))`,
            padding: space(4),
            border: `1px solid ${vars.border}`,
            borderRadius: vars.radiusLarge,
            color: vars.text,
            background: vars.surface,
            boxShadow: vars.shadow,
            fontFamily: vars.font,
            ...text.sm,
            textAlign: 'start'
        },
        anchored({ side: 'bottom', align: 'start' })
    ],
    'popover'
)

export const popoverTitle = style(
    {
        margin: `0 0 ${space(1)}`,
        ...text.base,
        fontWeight: weight.semibold,
        letterSpacing: trackingTight
    },
    'popover__title'
)

export const popoverActions = style(
    {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: space(2),
        marginTop: space(4)
    },
    'popover__actions'
)
