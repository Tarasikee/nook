'use client'

import type { RefCallback } from 'react'
import { useId } from 'react'
import { useNativePopover } from './useNativePopover.js'

export type UseTooltipOptions = {
    /**
     * How the tooltip relates to its trigger for assistive technology.
     * - `'description'` (default): supplementary text, via `aria-describedby`.
     * - `'label'`: the trigger's accessible name, via `aria-labelledby`. Use for icon-only buttons.
     */
    role?: 'description' | 'label'
    /** Called after the tooltip is shown or hidden. */
    onOpenChange?: (open: boolean) => void
    /** Overrides the generated id of the tooltip element. */
    id?: string
}

export type TooltipTriggerProps = {
    interestfor: string
    'aria-describedby'?: string
    'aria-labelledby'?: string
}

export type TooltipContentProps = {
    id: string
    popover: 'hint'
    role: 'tooltip'
    ref: RefCallback<HTMLElement>
}

export type UseTooltipResult = {
    /** The browser's actual open state. */
    open: boolean
    /** Spread onto a `<button>`, `<a>`, or `<area>`. Contains attributes only: no event handlers or refs. */
    triggerProps: TooltipTriggerProps
    /** Spread onto the tooltip element. */
    contentProps: TooltipContentProps
}

/**
 * A tooltip shown by the browser on hover, focus, or long press through the
 * native `interestfor` attribute. Delays come from the CSS `interest-delay`
 * property.
 *
 * The hook adds an explicit accessible relationship: browsers expose the
 * native one only while the tooltip is open.
 */
export function useTooltip({ role = 'description', onOpenChange, id: providedId }: UseTooltipOptions = {}): UseTooltipResult {
    const generatedId = useId()
    const id = providedId ?? generatedId
    const { store, open } = useNativePopover(onOpenChange)

    return {
        open,
        triggerProps:
            role === 'label' ? { interestfor: id, 'aria-labelledby': id } : { interestfor: id, 'aria-describedby': id },
        contentProps: {
            id,
            popover: 'hint',
            role: 'tooltip',
            ref: store.attach
        }
    }
}
