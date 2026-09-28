export type PopoverMode = 'auto' | 'manual' | 'hint'

export type PopoverController = {
    destroy(): void
    hide(): void
    isOpen(): boolean
    show(): void
    toggle(): boolean
}

export type PopoverOptions = {
    content: HTMLElement
    mode?: PopoverMode
    onToggle?(isOpen: boolean): void
    trigger: HTMLButtonElement | HTMLInputElement
}

export type TooltipOptions = {
    content: HTMLElement
    closeDelay?: number
    openDelay?: number
    onToggle?(isOpen: boolean): void
    trigger: HTMLElement
}

type NativePopoverElement = HTMLElement & {
    showPopover(options?: { source?: HTMLElement }): void
    togglePopover(options?: boolean | { force?: boolean; source?: HTMLElement }): boolean
}

function isOpen(content: HTMLElement) {
    return content.matches(':popover-open')
}

function requirePopover(content: HTMLElement): NativePopoverElement {
    if (!('showPopover' in content)) {
        throw new Error('Nook requires the Popover API in this browser.')
    }

    return content as NativePopoverElement
}

function restoreAttribute(element: HTMLElement, name: string, value: string | null) {
    if (value === null) {
        element.removeAttribute(name)
        return
    }

    element.setAttribute(name, value)
}

/**
 * Connects a button-like trigger to a native popover without owning its click handler.
 */
export function createPopover({ content, mode = 'auto', onToggle, trigger }: PopoverOptions): PopoverController {
    const popover = requirePopover(content)

    if (!content.id) {
        throw new Error('A Nook popover needs an id so its trigger can reference it.')
    }

    const previousPopover = content.getAttribute('popover')
    const previousTarget = trigger.getAttribute('popovertarget')
    const previousAction = trigger.getAttribute('popovertargetaction')

    content.setAttribute('popover', mode)
    trigger.setAttribute('popovertarget', content.id)
    trigger.setAttribute('popovertargetaction', 'toggle')

    const toggleListener = () => onToggle?.(isOpen(content))
    content.addEventListener('toggle', toggleListener)

    return {
        destroy() {
            content.removeEventListener('toggle', toggleListener)
            restoreAttribute(content, 'popover', previousPopover)
            restoreAttribute(trigger, 'popovertarget', previousTarget)
            restoreAttribute(trigger, 'popovertargetaction', previousAction)
        },
        hide() {
            if (isOpen(content)) {
                popover.hidePopover()
            }
        },
        isOpen: () => isOpen(content),
        show() {
            if (!isOpen(content)) {
                popover.showPopover({ source: trigger })
            }
        },
        toggle() {
            return popover.togglePopover({ source: trigger })
        }
    }
}

/**
 * Shows a native hint popover from hover and keyboard focus using independent DOM listeners.
 */
export function createTooltip({
    closeDelay = 80,
    content,
    onToggle,
    openDelay = 400,
    trigger
}: TooltipOptions): PopoverController {
    const popover = requirePopover(content)

    const previousPopover = content.getAttribute('popover')
    const abortController = new AbortController()
    let closeTimeout: ReturnType<typeof setTimeout> | undefined
    let openTimeout: ReturnType<typeof setTimeout> | undefined

    content.setAttribute('popover', 'hint')

    const clearTimers = () => {
        clearTimeout(closeTimeout)
        clearTimeout(openTimeout)
    }

    const hide = () => {
        clearTimers()
        if (isOpen(content)) {
            popover.hidePopover()
        }
    }

    const show = () => {
        clearTimers()
        if (!isOpen(content)) {
            popover.showPopover({ source: trigger })
        }
    }

    const queueHide = () => {
        clearTimeout(closeTimeout)
        closeTimeout = setTimeout(hide, closeDelay)
    }

    const queueShow = () => {
        clearTimeout(openTimeout)
        openTimeout = setTimeout(show, openDelay)
    }

    const toggleListener = () => onToggle?.(isOpen(content))
    content.addEventListener('toggle', toggleListener, { signal: abortController.signal })
    trigger.addEventListener('pointerenter', queueShow, { signal: abortController.signal })
    trigger.addEventListener('pointerleave', queueHide, { signal: abortController.signal })
    trigger.addEventListener('focusin', queueShow, { signal: abortController.signal })
    trigger.addEventListener('focusout', queueHide, { signal: abortController.signal })

    return {
        destroy() {
            clearTimers()
            abortController.abort()
            restoreAttribute(content, 'popover', previousPopover)
        },
        hide,
        isOpen: () => isOpen(content),
        show,
        toggle() {
            clearTimers()
            return popover.togglePopover({ source: trigger })
        }
    }
}
