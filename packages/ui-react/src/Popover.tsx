import { usePopover, type PopoverCloseProps } from '@nook/react'
import * as ui from '@nook/ui'
import { createContext, use, type HTMLAttributes, type ReactElement, type ReactNode } from 'react'
import { Button, type ButtonProps } from './Button.js'
import { classNames, withTriggerProps } from './merge.js'
import type { Align, Side } from './Tooltip.js'

export type PopoverProps = {
    /** The panel body. Put a `PopoverClose` inside to close it without JavaScript. */
    content: ReactNode
    /** Rendered as the panel's heading and accessible name. Without it, name the panel through `panelProps`. */
    title?: ReactNode
    /** `'auto'` (default) closes on outside clicks and Escape; `'manual'` only through the trigger or code. */
    mode?: 'auto' | 'manual'
    open?: boolean
    defaultOpen?: boolean
    onOpenChange?: (open: boolean) => void
    /** `'bottom'` by default. */
    side?: Side
    /** `'start'` by default. */
    align?: Align
    /** Extra attributes for the panel, such as `className` or `aria-label`. */
    panelProps?: HTMLAttributes<HTMLDivElement>
    /** One `<button>`, `Button`, or `Tooltip` wrapping a button. */
    children: ReactElement
}

const CloseContext = createContext<PopoverCloseProps | null>(null)

/** A click popover on the native `popovertarget` relationship, styled by `@nook/ui`. */
export function Popover({
    content,
    title,
    mode,
    open,
    defaultOpen,
    onOpenChange,
    side = 'bottom',
    align = 'start',
    panelProps,
    children,
    ...rest
}: PopoverProps) {
    const popover = usePopover({ mode, open, defaultOpen, onOpenChange })
    const { 'aria-labelledby': titleId, ...contentProps } = popover.contentProps

    return (
        <>
            {withTriggerProps(children, { ...rest, ...popover.triggerProps })}
            <div
                {...panelProps}
                {...contentProps}
                aria-labelledby={title ? titleId : panelProps?.['aria-labelledby']}
                className={classNames(ui.popover, panelProps?.className)}
                data-side={side}
                data-align={align}
            >
                {title ? (
                    <h2 {...popover.titleProps} className={ui.popoverTitle}>
                        {title}
                    </h2>
                ) : null}
                <CloseContext value={popover.closeProps}>{content}</CloseContext>
            </div>
        </>
    )
}

/** Closes the surrounding `Popover` natively (`popovertargetaction="hide"`). A ghost `Button` by default. */
export function PopoverClose({ children = 'Close', ...props }: ButtonProps) {
    const closeProps = use(CloseContext)
    if (!closeProps) {
        throw new Error('Nook UI: PopoverClose must be rendered inside Popover content.')
    }

    return (
        <Button variant="ghost" size="small" {...props} {...closeProps}>
            {children}
        </Button>
    )
}
