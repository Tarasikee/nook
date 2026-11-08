'use client'

import { useLayoutEffect } from 'react'

export function usePopoverControl(element: HTMLElement | null, open: boolean, source?: HTMLElement | null): void {
    useLayoutEffect(() => {
        if (!element?.isConnected || element.matches(':popover-open') === open) {
            return
        }

        if (open) {
            const popover = element as HTMLElement & { showPopover(options?: { source: HTMLElement }): void }
            popover.showPopover(source ? { source } : undefined)
        } else {
            element.hidePopover()
        }
    }, [element, open, source])
}
