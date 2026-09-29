import { cloneElement, isValidElement, type ReactElement } from 'react'

type Props = Record<string, unknown>

const idReferences = ['aria-describedby', 'aria-labelledby'] as const

export function classNames(...names: unknown[]): string {
    return names.filter((name) => typeof name === 'string' && name.length > 0).join(' ')
}

/**
 * Adds trigger attributes to a wrapper's single child. Id references are combined and classes
 * joined; other injected attributes win. Wrappers pass their extra props through here too, so
 * `<Tooltip><Popover><Button /></Popover></Tooltip>` ends with every attribute on the button.
 */
export function withTriggerProps(child: ReactElement, injected: Props): ReactElement {
    if (!isValidElement(child)) {
        throw new Error('Nook UI: Tooltip, Popover, and Dialog need a single element child as their trigger.')
    }

    const own = child.props as Props
    const merged: Props = { ...injected }

    for (const key of idReferences) {
        const ids = classNames(own[key], injected[key])
        if (ids) {
            merged[key] = ids
        }
    }

    const className = classNames(own.className, injected.className)
    if (className) {
        merged.className = className
    }

    return cloneElement(child as ReactElement<Props>, merged)
}
