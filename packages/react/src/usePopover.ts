'use client'

import type { RefCallback } from 'react'
import { useEffect, useEffectEvent, useId } from 'react'
import { useNativePopover } from './useNativePopover.js'

export type UsePopoverOptions = {
    /** Native popover mode. `'auto'` light-dismisses; `'manual'` closes only through the trigger, a close button, or code. */
    mode?: 'auto' | 'manual'
    /** Controlled open state. The browser can still close an `'auto'` popover; see `onOpenChange`. */
    open?: boolean
    /** Opens the popover once after it mounts. Ignored when `open` is provided. */
    defaultOpen?: boolean
    /** Called after every native state change, including Escape and light dismiss. */
    onOpenChange?: (open: boolean) => void
    /** Overrides the generated id of the content element. */
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
    /** The browser's actual open state. */
    open: boolean
    show(): void
    hide(): void
    toggle(): void
    /** Spread onto a `<button>`. Contains attributes only: no event handlers or refs. */
    triggerProps: PopoverTriggerProps
    /** Spread onto the popover surface. */
    contentProps: PopoverContentProps
    /** Spread onto the element that names the popover, usually a heading. */
    titleProps: PopoverTitleProps
    /** Spread onto a `<button>` inside the popover that closes it without JavaScript. */
    closeProps: PopoverCloseProps
}

/**
 * A click-triggered popover built on the native `popovertarget` relationship.
 *
 * The trigger, close button, Escape, and light dismiss work from server-rendered
 * HTML before hydration. After hydration the hook reads native state; it holds
 * no React state of its own.
 */
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

    const { store, open } = useNativePopover(onOpenChange)

    // Synchronizes an external system (the browser) with a prop; sets no React state.
    useEffect(() => {
        store.control(controlledOpen)
    }, [store, controlledOpen])

    const openByDefault = useEffectEvent(() => {
        if (controlledOpen === undefined && defaultOpen) {
            store.setOpen(true)
        }
    })

    useEffect(() => {
        openByDefault()
    }, [])

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
            ref: store.attach
        },
        titleProps: { id: titleId },
        closeProps: { popoverTarget: id, popoverTargetAction: 'hide' }
    }
}
