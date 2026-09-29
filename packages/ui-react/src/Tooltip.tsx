import { useTooltip } from '@nook/react'
import * as ui from '@nook/ui'
import type { HTMLAttributes, ReactElement, ReactNode, Ref } from 'react'
import { classNames, withTriggerProps } from './merge.js'

export type Side = 'top' | 'bottom' | 'left' | 'right'
export type Align = 'start' | 'center' | 'end'

export type TooltipProps = {
    /** Short, non-interactive text. */
    label: ReactNode
    /** The tooltip names its trigger (for icon-only buttons) instead of describing it. */
    asLabel?: boolean
    /** `'top'` by default. */
    side?: Side
    /** `'center'` by default. */
    align?: Align
    onOpenChange?: (open: boolean) => void
    /** One element that supports `interestfor`: a `<button>`, `<a>`, `Button`, or a `Popover`. */
    children: ReactElement
}

/**
 * Shows `label` on hover, focus, or long press through the native `interestfor` attribute.
 * Delays and styling come from `@nook/ui`. Chromium 142+.
 */
export function Tooltip({
    label,
    asLabel = false,
    side = 'top',
    align = 'center',
    onOpenChange,
    children,
    ...rest
}: TooltipProps) {
    const tooltip = useTooltip({ role: asLabel ? 'label' : 'description', onOpenChange })

    return (
        <>
            {withTriggerProps(children, { ...rest, ...tooltip.triggerProps })}
            <div {...tooltip.contentProps} className={ui.tooltip} data-side={side} data-align={align}>
                {label}
            </div>
        </>
    )
}

export type TooltipGroupProps = HTMLAttributes<HTMLDivElement> & { ref?: Ref<HTMLDivElement> }

/**
 * A `<div>` in which, once one tooltip shows, the next opens without the delay. Pure CSS
 * (`:has(:interest-source)`) and unstyled, so make it the element that holds the triggers:
 * `<TooltipGroup role="toolbar" aria-label="Formatting">`.
 */
export function TooltipGroup({ className, ...props }: TooltipGroupProps) {
    return <div {...props} className={classNames(ui.tooltipGroup, className)} />
}
