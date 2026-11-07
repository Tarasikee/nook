'use client'

import type { RefCallback } from 'react'
import { useId } from 'react'
import { useNativePopover } from './use-native-popover'

export type UsePopoverOptions = {
    mode?: 'auto' | 'manual'
    open?: boolean
    defaultOpen?: boolean
    onOpenChange?: (open: boolean) => void
    id?: string
}

export type PopoverTriggerProps = {
    popoverTarget: string
    'data-open'?: ''
}

export type PopoverContentProps = {
    id: string
    popover: 'auto' | 'manual'
    'aria-labelledby': string
    ref: RefCallback<HTMLElement>
}

export type PopoverTitleProps = {
    id: string
}

export type PopoverCloseProps = {
    popoverTarget: string
    popoverTargetAction: 'hide'
}

export type UsePopoverResult = {
    open: boolean
    show(): void
    hide(): void
    toggle(): void
    triggerProps: PopoverTriggerProps
    contentProps: PopoverContentProps
    titleProps: PopoverTitleProps
    closeProps: PopoverCloseProps
}

export function usePopover({
    mode = 'auto',
    open: controlledOpen,
    defaultOpen = false,
    onOpenChange,
    id: providedId
}: UsePopoverOptions = {}): UsePopoverResult {
    const generatedId = useId()
    const id = providedId ?? generatedId
    const titleId = `${id}-title`

    const { store, open, ref } = useNativePopover(onOpenChange, defaultOpen, controlledOpen)

    return {
        open,
        show: () => store.setOpen(true),
        hide: () => store.setOpen(false),
        toggle: () => store.setOpen(!store.getSnapshot()),
        triggerProps: {
            popoverTarget: id,
            'data-open': open ? '' : undefined
        },
        contentProps: {
            id,
            popover: mode,
            'aria-labelledby': titleId,
            ref
        },
        titleProps: { id: titleId },
        closeProps: { popoverTarget: id, popoverTargetAction: 'hide' }
    }
}
