'use client'

import { useSyncExternalStore } from 'react'

const getServerSnapshot = () => false

export function usePopoverOpen(element: HTMLElement | null): boolean {
    return useSyncExternalStore(
        (listener) => {
            element?.addEventListener('toggle', listener)
            return () => element?.removeEventListener('toggle', listener)
        },
        () => element?.matches(':popover-open') ?? false,
        getServerSnapshot
    )
}
