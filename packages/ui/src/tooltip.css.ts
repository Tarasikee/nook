import { globalStyle, style } from '@vanilla-extract/css'
import { anchored } from './anchored'
import type {} from './csstype'
import { vars } from './tokens.css'

/*
 * <button interestfor="tip">…</button>
 * <div id="tip" class="nook-tooltip" popover="hint" role="tooltip">Save changes</div>
 */

// Timing is CSS through interest invokers. :where() keeps it easy to override.
globalStyle(':where([interestfor])', {
    interestDelay: `${vars.tooltip.delay} ${vars.tooltip.hideDelay}`
})

/** Once one tooltip in the group shows, the next opens without the delay. */
export const tooltipGroup = style({ display: 'contents' }, 'tooltip-group')

globalStyle(`${tooltipGroup}:has(:interest-source) [interestfor]`, { interestDelayStart: '0s' })

/** Above and centered unless `data-side` and `data-align` say otherwise. */
export const tooltip = style(
    [
        {
            boxSizing: 'border-box',
            padding: '0.35rem 0.6rem',
            border: 0,
            borderRadius: 7,
            color: vars.tooltip.text,
            background: vars.tooltip.surface,
            boxShadow: vars.shadow,
            font: `600 0.75rem/1.4 ${vars.font}`,
            whiteSpace: 'nowrap'
        },
        anchored({ side: 'top', align: 'center' })
    ],
    'tooltip'
)
