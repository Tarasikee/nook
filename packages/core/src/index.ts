export type PopoverMode = 'auto' | 'manual' | 'hint'

type ShowPopoverOptions = { source?: HTMLElement }

type NativePopover = HTMLElement & {
    showPopover(options?: ShowPopoverOptions): void
}

const invokerSelector = (id: string) => {
    const escaped = CSS.escape(id)
    return `[popovertarget="${escaped}"], [commandfor="${escaped}"], [interestfor="${escaped}"]`
}

export function isPopoverOpen(element: Element): boolean {
    return element.matches(':popover-open')
}

export function findPopoverInvoker(popover: HTMLElement): HTMLElement | null {
    if (!popover.id) {
        return null
    }

    const root = popover.getRootNode() as Document | ShadowRoot
    return root.querySelector<HTMLElement>(invokerSelector(popover.id))
}

export function setPopoverOpen(popover: HTMLElement, open: boolean, source?: HTMLElement | null): void {
    if (!popover.isConnected || isPopoverOpen(popover) === open) {
        return
    }

    if (!open) {
        popover.hidePopover()
        return
    }

    const invoker = source === undefined ? findPopoverInvoker(popover) : source
    ;(popover as NativePopover).showPopover(invoker ? { source: invoker } : undefined)
}

export function observePopover(popover: HTMLElement, onChange: (open: boolean) => void): () => void {
    const listener = (event: Event) => {
        const { newState, oldState } = event as ToggleEvent
        if (newState !== oldState) {
            onChange(newState === 'open')
        }
    }

    popover.addEventListener('toggle', listener)
    return () => popover.removeEventListener('toggle', listener)
}

export type PopoverStore = {
    attach(element: HTMLElement | null): (() => void) | undefined
    subscribe(listener: () => void): () => void
    onChange(listener: (open: boolean) => void): () => void
    getSnapshot(): boolean
    setOpen(open: boolean): void
    control(open: boolean | undefined): void
}

export function createPopoverStore(): PopoverStore {
    let element: HTMLElement | null = null
    let pending: boolean | undefined
    let controlled: boolean | undefined
    const snapshotListeners = new Set<() => void>()
    const changeListeners = new Set<(open: boolean) => void>()

    const notify = () => {
        for (const listener of snapshotListeners) {
            listener()
        }
    }

    return {
        attach(next) {
            if (!next) {
                return undefined
            }

            element = next
            const stopObserving = observePopover(next, (open) => {
                notify()
                for (const listener of changeListeners) {
                    listener(open)
                }
            })

            const requested = controlled ?? pending
            pending = undefined
            if (requested !== undefined) {
                setPopoverOpen(next, requested)
            }
            notify()

            return () => {
                stopObserving()
                if (element === next) {
                    element = null
                    notify()
                }
            }
        },
        subscribe(listener) {
            snapshotListeners.add(listener)
            return () => snapshotListeners.delete(listener)
        },
        onChange(listener) {
            changeListeners.add(listener)
            return () => changeListeners.delete(listener)
        },
        getSnapshot() {
            return element ? isPopoverOpen(element) : false
        },
        setOpen(open) {
            if (element) {
                setPopoverOpen(element, open)
            } else {
                pending = open
            }
        },
        control(open) {
            controlled = open
            if (element && open !== undefined) {
                setPopoverOpen(element, open)
            }
        }
    }
}
