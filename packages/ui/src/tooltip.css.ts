import { globalStyle, style } from '@vanilla-extract/css'
import { anchored } from './anchored'
import { space, text, weight } from './scale'
import { vars } from './tokens.css'

globalStyle(':where([interestfor])', {
    interestDelay: `${vars.tooltip.delay} ${vars.tooltip.hideDelay}`
})

export const tooltipGroup = style({}, 'tooltip-group')

globalStyle(`${tooltipGroup}:has(:interest-source) [interestfor]`, { interestDelayStart: '0s' })

export const tooltip = style(
    [
        {
            boxSizing: 'border-box',
            padding: `${space(1.5)} ${space(3)}`,
            border: 0,
            borderRadius: vars.radius,
            color: vars.tooltip.text,
            background: vars.tooltip.surface,
            boxShadow: vars.shadow,
            fontFamily: vars.font,
            ...text.xs,
            fontWeight: weight.medium,
            whiteSpace: 'nowrap'
        },
        anchored({ side: 'top', align: 'center' })
    ],
    'tooltip'
)
