import { useTooltip } from '@nook/react'
import * as ui from '@nook/ui'
import type { HTMLAttributes, ReactElement, ReactNode, Ref } from 'react'
import { classNames, withTriggerProps } from './merge'

export type Side = 'top' | 'bottom' | 'left' | 'right'
export type Align = 'start' | 'center' | 'end'

export type TooltipProps = {
    label: ReactNode
    asLabel?: boolean
    side?: Side
    align?: Align
    onOpenChange?: (open: boolean) => void
    children: ReactElement
}

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

export function TooltipGroup({ className, ...props }: TooltipGroupProps) {
    return <div {...props} className={classNames(ui.tooltipGroup, className)} />
}
