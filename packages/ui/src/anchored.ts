import type { StyleRule } from '@vanilla-extract/css'
import { vars } from './tokens.css'

type Side = 'top' | 'bottom' | 'left' | 'right'

// Where each side puts the surface, and the margin that faces the trigger.
const sides = {
    top: { area: 'block-start', offset: 'marginBlockEnd' },
    bottom: { area: 'block-end', offset: 'marginBlockStart' },
    left: { area: 'inline-start', offset: 'marginInlineEnd' },
    right: { area: 'inline-end', offset: 'marginInlineStart' }
} as const

const closed = { opacity: 0, scale: '0.96' }

/**
 * Placement next to the trigger, and open/close motion, for tooltip and popover surfaces.
 *
 * The trigger is the implicit anchor (popovertarget / interestfor), so position-area is enough.
 * `data-side` (top | bottom | left | right) and `data-align` (start | center | end) override the
 * defaults. Browsers without anchor positioning keep the default centered popover.
 */
export function anchored(defaults: { side: 'top' | 'bottom'; align: 'start' | 'center' }): StyleRule {
    const facing = (side: Side) => ({
        vars: { '--nook-side': sides[side].area },
        [sides[side].offset]: vars.offset
    })

    return {
        ...closed,
        transition: [
            `opacity ${vars.duration} ease-out`,
            `scale ${vars.duration} ease-out`,
            `display ${vars.duration} allow-discrete`,
            `overlay ${vars.duration} allow-discrete`
        ].join(', '),
        selectors: {
            '&:popover-open': { opacity: 1, scale: '1', '@starting-style': closed }
        },
        '@media': {
            '(prefers-reduced-motion: reduce)': { transition: 'none' }
        },
        '@supports': {
            '(position-area: block-end)': {
                // What start and end mean along the edge that faces the trigger.
                vars: {
                    '--nook-start': 'span-inline-end',
                    '--nook-end': 'span-inline-start',
                    '--nook-side': sides[defaults.side].area,
                    '--nook-align': defaults.align === 'center' ? 'center' : 'var(--nook-start)'
                },
                inset: 'auto',
                margin: 0,
                [sides[defaults.side].offset]: vars.offset,
                positionArea: 'var(--nook-side) var(--nook-align)',
                positionTryFallbacks: 'flip-block, flip-inline',
                selectors: {
                    '&[data-side]': { margin: 0 },
                    "&[data-side='top']": facing('top'),
                    "&[data-side='bottom']": facing('bottom'),
                    "&[data-side='left']": facing('left'),
                    "&[data-side='right']": facing('right'),
                    "&:is([data-side='left'], [data-side='right'])": {
                        vars: {
                            '--nook-start': 'span-block-end',
                            '--nook-end': 'span-block-start',
                            '--nook-align': 'center'
                        }
                    },
                    "&[data-align='start']": { vars: { '--nook-align': 'var(--nook-start)' } },
                    "&[data-align='center']": { vars: { '--nook-align': 'center' } },
                    "&[data-align='end']": { vars: { '--nook-align': 'var(--nook-end)' } }
                }
            }
        }
    }
}
