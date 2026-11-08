'use client'

import { useId } from 'react'

export type UsePopoverOptions = {
    mode?: 'auto' | 'manual'
    id?: string
}

export type PopoverTriggerProps = {
    popoverTarget: string
}

export type PopoverContentProps = {
    id: string
    popover: 'auto' | 'manual'
    'aria-labelledby': string
}

export type PopoverTitleProps = {
    id: string
}

export type PopoverCloseProps = {
    popoverTarget: string
    popoverTargetAction: 'hide'
}

export type UsePopoverResult = {
    triggerProps: PopoverTriggerProps
    contentProps: PopoverContentProps
    titleProps: PopoverTitleProps
    closeProps: PopoverCloseProps
}

export function usePopover({ mode = 'auto', id: providedId }: UsePopoverOptions = {}): UsePopoverResult {
    const generatedId = useId()
    const id = providedId ?? generatedId
    const titleId = `${id}-title`

    return {
        triggerProps: {
            popoverTarget: id
        },
        contentProps: {
            id,
            popover: mode,
            'aria-labelledby': titleId
        },
        titleProps: { id: titleId },
        closeProps: { popoverTarget: id, popoverTargetAction: 'hide' }
    }
}
