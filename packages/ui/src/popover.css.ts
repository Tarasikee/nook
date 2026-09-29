import { style } from '@vanilla-extract/css'
import { anchored } from './anchored'
import { vars } from './tokens.css'

/*
 * <button popovertarget="share">Share</button>
 * <div id="share" class="nook-popover" popover aria-labelledby="share-title">
 *     <h2 id="share-title" class="nook-popover__title">Invite collaborators</h2>
 *     <div class="nook-popover__actions">…</div>
 * </div>
 */

/** Below and start-aligned unless `data-side` and `data-align` say otherwise. */
export const popover = style(
    [
        {
            boxSizing: 'border-box',
            width: 'min(320px, calc(100vw - 2rem))',
            padding: '1rem',
            border: `1px solid ${vars.border}`,
            borderRadius: vars.radiusLarge,
            color: vars.text,
            background: vars.surface,
            boxShadow: vars.shadow,
            font: `0.875rem/1.55 ${vars.font}`,
            textAlign: 'start'
        },
        anchored({ side: 'bottom', align: 'start' })
    ],
    'popover'
)

export const popoverTitle = style(
    {
        margin: '0 0 0.25rem',
        fontSize: '1rem',
        fontWeight: 700,
        lineHeight: 1.3,
        letterSpacing: '-0.02em'
    },
    'popover__title'
)

export const popoverActions = style(
    {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '0.5rem',
        marginTop: '0.9rem'
    },
    'popover__actions'
)
