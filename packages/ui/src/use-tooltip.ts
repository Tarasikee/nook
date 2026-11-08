'use client'

import { useId } from 'react'

export type UseTooltipOptions = {
    role?: 'description' | 'label'
    id?: string
}

export type TooltipTriggerProps = {
    interestfor: string
    className: string
    'aria-describedby'?: string
    'aria-labelledby'?: string
}

export type TooltipContentProps = {
    id: string
    popover: 'hint'
    role: 'tooltip'
}

export type UseTooltipResult = {
    triggerProps: TooltipTriggerProps
    contentProps: TooltipContentProps
}

export function useTooltip({ role = 'description', id: providedId }: UseTooltipOptions = {}): UseTooltipResult {
    const generatedId = useId()
    const id = providedId ?? generatedId
    return {
        triggerProps: {
            interestfor: id,
            className: '[interest-delay:var(--nook-tooltip-delay,300ms)_var(--nook-tooltip-hide-delay,100ms)]',
            ...(role === 'label' ? { 'aria-labelledby': id } : { 'aria-describedby': id })
        },
        contentProps: {
            id,
            popover: 'hint',
            role: 'tooltip'
        }
    }
}
