import { globalStyle, style } from '@vanilla-extract/css'
import { vars } from '../theme.css'

/*
 * Nook adds no styles: these are the consumer styles behind the demos. Panels and tooltips are
 * native popovers, anchored to their trigger and animated with CSS alone.
 */

const surface = style({
    border: `1px solid ${vars.border}`,
    color: vars.text[1],
    background: vars.bg.elv,
    boxShadow: vars.popoverShadow,
    // Placement. popovertarget and interestfor make the trigger the popover's implicit anchor, so
    // no anchor-name is needed. Without anchor positioning, the default centered placement remains.
    '@supports': {
        '(position-area: block-end)': {
            inset: 'auto',
            margin: 0,
            positionTryFallbacks: 'flip-block, flip-inline'
        }
    }
})

export const panel = style([
    surface,
    {
        width: 'min(320px, calc(100vw - 2rem))',
        padding: '1rem',
        borderRadius: 14,
        textAlign: 'left',
        '@supports': {
            '(position-area: block-end)': {
                positionArea: 'block-end span-inline-end',
                marginBlockStart: 8
            }
        }
    }
])

globalStyle(`${panel} code`, {
    color: vars.brand[1],
    fontFamily: vars.font.mono,
    fontSize: '0.76rem',
    whiteSpace: 'nowrap'
})

export const eyebrow = style({
    display: 'block',
    color: vars.skyText,
    fontFamily: vars.font.mono,
    fontSize: '0.68rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase'
})

export const title = style({
    margin: '0.3rem 0 0.2rem',
    color: vars.text[1],
    fontSize: '0.98rem',
    fontWeight: 700,
    lineHeight: 1.3,
    letterSpacing: '-0.02em'
})

export const text = style({
    margin: 0,
    color: vars.text[2],
    fontSize: '0.82rem',
    lineHeight: 1.55
})

export const actions = style({
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.5rem',
    marginTop: '0.9rem'
})

export const tooltip = style([
    surface,
    {
        padding: '0.35rem 0.6rem',
        borderRadius: 7,
        borderColor: 'transparent',
        color: vars.tooltip.text,
        background: vars.tooltip.bg,
        fontSize: '0.76rem',
        fontWeight: 600,
        whiteSpace: 'nowrap',
        '@supports': {
            '(position-area: block-end)': {
                positionArea: 'block-start',
                marginBlockEnd: 8
            }
        }
    }
])

// Tooltip timing comes from CSS through interest invokers, not from JavaScript.
globalStyle('[interestfor]', { interestDelay: '300ms 100ms' })

/** Tooltip groups: once one tooltip in a group is showing, the next opens without the delay. */
export const group = style({})

globalStyle(`${group}:has(:interest-source) [interestfor]`, { interestDelayStart: '0s' })

const hidden = { opacity: 0, scale: '0.96', translate: '0 -4px' }

/** Entry and exit transitions. */
export const animated = style({
    ...hidden,
    transition: [
        'opacity 0.16s ease-out',
        'scale 0.16s ease-out',
        'translate 0.16s ease-out',
        'display 0.16s allow-discrete',
        'overlay 0.16s allow-discrete'
    ].join(', '),
    selectors: {
        '&:popover-open': {
            opacity: 1,
            scale: '1',
            translate: '0 0',
            // The first frame after display: none.
            '@starting-style': hidden
        }
    },
    '@media': {
        '(prefers-reduced-motion: reduce)': { transition: 'none' }
    }
})
