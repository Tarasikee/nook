import { createPopoverStore, type PopoverStore } from '@nook/core'
import { useEffect, useEffectEvent, useState, useSyncExternalStore } from 'react'

const getServerSnapshot = () => false

/**
 * Subscribes to a popover's native open state.
 *
 * The browser is the source of truth, so there is no React state to keep in
 * sync: `useSyncExternalStore` reads `:popover-open` through the store, and no
 * effect ever sets state. `onOpenChange` is delivered from the native `toggle`
 * listener through an Effect Event, so it always sees the latest callback
 * without re-subscribing.
 */
export function useNativePopover(onOpenChange: ((open: boolean) => void) | undefined): {
    store: PopoverStore
    open: boolean
} {
    // Lazy initializer: one store per hook instance, created once, no memoization needed.
    const [store] = useState(createPopoverStore)
    const open = useSyncExternalStore(store.subscribe, store.getSnapshot, getServerSnapshot)

    const reportChange = useEffectEvent((next: boolean) => {
        onOpenChange?.(next)
    })

    useEffect(() => store.onChange((next) => reportChange(next)), [store])

    return { store, open }
}
