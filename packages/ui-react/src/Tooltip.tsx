import { useTooltip } from '@nook/react'
import type { HTMLAttributes, ReactElement, ReactNode } from 'react'
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
            <div {...tooltip.contentProps} className="nook-tooltip" data-side={side} data-align={align}>
                {label}
            </div>
        </>
    )
}

/**
 * Once one tooltip inside shows, the next opens without the delay. Pure CSS (`:has(:interest-source)`);
 * renders a `display: contents` element, so it adds no layout. Don't give it a role.
 */
export function TooltipGroup({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return <div {...props} className={classNames('nook-tooltip-group', className)} />
}
