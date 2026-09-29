import { style } from '@vanilla-extract/css'
import { panel } from './popover.css'

export const layout = style({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.25rem',
    width: '100%'
})

export const options = style({
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '0.35rem',
    maxWidth: 560
})

export const area = style({
    display: 'grid',
    placeItems: 'center',
    width: '100%',
    minHeight: 220
})

/** A compact panel placed at `--area`, which React sets from the chosen placement. */
export const placement = style([
    panel,
    {
        width: 'auto',
        padding: '0.55rem 0.75rem',
        borderRadius: 9,
        '@supports': {
            '(position-area: block-end)': {
                positionArea: 'var(--area)',
                // A margin on every side offsets the popover from the trigger in any placement.
                margin: 8,
                positionTryFallbacks: 'none'
            }
        }
    }
])
