/**
 * Nook core: the small amount of DOM behavior the platform does not provide.
 *
 * Opening, closing, dismissal, focus return, layering, anchoring, and hover or
 * focus intent come from native HTML (`popover`, `popovertarget`, `commandfor`,
 * `interestfor`) and CSS. Core only observes and drives that native state so
 * framework bindings can stay in sync with it.
 */

export type PopoverMode = 'auto' | 'manual' | 'hint'

type ShowPopoverOptions = { source?: HTMLElement }

type NativePopover = HTMLElement & {
    showPopover(options?: ShowPopoverOptions): void
}

const invokerSelector = (id: string) => {
    const escaped = CSS.escape(id)
    return `[popovertarget="${escaped}"], [commandfor="${escaped}"], [interestfor="${escaped}"]`
}

/**
 * Returns whether the element is currently shown as a popover.
 */
export function isPopoverOpen(element: Element): boolean {
    return element.matches(':popover-open')
}

/**
 * Finds the first element that invokes the popover through `popovertarget`,
 * `commandfor`, or `interestfor`, searching the popover's own document or shadow root.
 */
export function findPopoverInvoker(popover: HTMLElement): HTMLElement | null {
    if (!popover.id) {
        return null
    }

    const root = popover.getRootNode() as Document | ShadowRoot
    return root.querySelector<HTMLElement>(invokerSelector(popover.id))
}

/**
 * Shows or hides a popover, doing nothing if it is already in the requested
 * state or not connected.
 *
 * When showing, the popover's invoker is passed as `source` so that the
 * implicit anchor and focus navigation match a native invocation. Without a
 * source, programmatically shown popovers are not anchored to their trigger.
 */
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

/**
 * Calls `onChange` with the popover's new state after every native toggle,
 * whatever caused it: an invoker, Escape, light dismiss, or script.
 *
 * Browsers coalesce rapid changes into one `toggle` event. A coalesced event
 * that ends in the state it started from (for example, shown and hidden in the
 * same task) is not a change and is not reported.
 *
 * Returns a function that removes the listener.
 */
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

/**
 * A popover's native state as an external store, for bindings that subscribe
 * to it (React's `useSyncExternalStore`, Vue, Svelte).
 *
 * The browser remains the source of truth: `getSnapshot()` reads
 * `:popover-open` directly. The store only tracks which element is attached
 * and which open state the application has requested.
 */
export type PopoverStore = {
    /** Attaches the popover element. Returns a detach function, so it can serve as a React 19 ref callback. */
    attach(element: HTMLElement | null): (() => void) | undefined
    /** Subscribes to snapshot changes: state changes and attach or detach. */
    subscribe(listener: () => void): () => void
    /** Subscribes to native state changes only, whatever caused them. */
    onChange(listener: (open: boolean) => void): () => void
    /** The browser's current open state; `false` when nothing is attached. */
    getSnapshot(): boolean
    /** Requests a state now, or once the element attaches. */
    setOpen(open: boolean): void
    /** Applies a controlled state now and on every later attach. `undefined` releases control. */
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
