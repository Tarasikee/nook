'use client'

import type { RefCallback } from 'react'
import { useId } from 'react'
import { useNativePopover } from './useNativePopover'

export type UseTooltipOptions = {
    role?: 'description' | 'label'
    onOpenChange?: (open: boolean) => void
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
    open: boolean
    triggerProps: TooltipTriggerProps
    contentProps: TooltipContentProps
}

export function useTooltip({
    role = 'description',
    onOpenChange,
    id: providedId
}: UseTooltipOptions = {}): UseTooltipResult {
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
