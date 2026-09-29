import { globalStyle, style } from '@vanilla-extract/css'
import { anchored } from './anchored'
import type {} from './csstype'
import { space, text, weight } from './scale'
import { vars } from './tokens.css'

/*
 * <button interestfor="tip">…</button>
 * <div id="tip" class="nook-tooltip" popover="hint" role="tooltip">Save changes</div>
 */

// Timing is CSS through interest invokers. :where() keeps it easy to override.
globalStyle(':where([interestfor])', {
    interestDelay: `${vars.tooltip.delay} ${vars.tooltip.hideDelay}`
})

/**
 * Once one tooltip in the group shows, the next opens without the delay. Adds no styles, so put it
 * on the element that already holds the triggers, such as a toolbar.
 */
export const tooltipGroup = style({}, 'tooltip-group')

globalStyle(`${tooltipGroup}:has(:interest-source) [interestfor]`, { interestDelayStart: '0s' })

/** Above and centered unless `data-side` and `data-align` say otherwise. */
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
