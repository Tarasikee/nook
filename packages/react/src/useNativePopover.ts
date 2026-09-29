import { createPopoverStore, type PopoverStore } from '@nook/core'
import { useEffect, useEffectEvent, useState, useSyncExternalStore } from 'react'

const getServerSnapshot = () => false

export function useNativePopover(onOpenChange: ((open: boolean) => void) | undefined): {
    store: PopoverStore
    open: boolean
} {
    const [store] = useState(createPopoverStore)
    const open = useSyncExternalStore(store.subscribe, store.getSnapshot, getServerSnapshot)

    const reportChange = useEffectEvent((next: boolean) => {
        onOpenChange?.(next)
    })

    useEffect(() => store.onChange((next) => reportChange(next)), [store])

    return { store, open }
}
