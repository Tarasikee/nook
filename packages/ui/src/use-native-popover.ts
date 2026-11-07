import { createPopoverStore, type PopoverStore } from './popover-store'
import { type RefCallback, useLayoutEffect, useState, useSyncExternalStore } from 'react'

const getServerSnapshot = () => false

export function useNativePopover(
    onOpenChange: ((open: boolean) => void) | undefined,
    defaultOpen = false,
    controlledOpen?: boolean
): {
    store: PopoverStore
    open: boolean
    ref: RefCallback<HTMLElement>
} {
    const [store] = useState(() => createPopoverStore(defaultOpen))
    const open = useSyncExternalStore(store.subscribe, store.getSnapshot, getServerSnapshot)

    useLayoutEffect(() => {
        // Subscribe before initializing so defaultOpen reports its first native toggle.
        const stopReporting = onOpenChange ? store.onChange(onOpenChange) : undefined
        store.control(controlledOpen)
        return stopReporting
    }, [store, controlledOpen, onOpenChange])

    return { store, open, ref: store.attach }
}
