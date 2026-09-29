import { type PopoverCloseProps, usePopover } from '@nook/react'
import * as ui from '@nook/ui'
import { createContext, type HTMLAttributes, type ReactElement, type ReactNode, use } from 'react'
import { Button, type ButtonProps } from './Button.js'
import { classNames, withTriggerProps } from './merge.js'
import type { Align, Side } from './Tooltip.js'

export type PopoverProps = {
    content: ReactNode
    title?: ReactNode
    mode?: 'auto' | 'manual'
    open?: boolean
    defaultOpen?: boolean
    onOpenChange?: (open: boolean) => void
    side?: Side
    align?: Align
    panelProps?: HTMLAttributes<HTMLDivElement>
    children: ReactElement
}

const CloseContext = createContext<PopoverCloseProps | null>(null)

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
