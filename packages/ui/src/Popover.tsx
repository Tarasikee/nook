'use client'

import { type PopoverCloseProps, usePopover } from './use-popover'
import { createContext, type HTMLAttributes, type ReactElement, type ReactNode, use } from 'react'
import { Button, type ButtonProps } from './Button'
import { cn } from './cn'
import { withTriggerProps, type Align, type Side } from './utils'

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
                className={cn(
                    'nook-popover box-border inset-auto m-0 w-[min(18rem,calc(100vw-2rem))] rounded-lg border border-slate-200 bg-white p-4 text-start font-sans text-sm text-slate-900 shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50',
                    'opacity-0 scale-95 open:opacity-100 open:scale-100 starting:open:opacity-0 starting:open:scale-95 transition-[opacity,scale,display,overlay] transition-discrete duration-150 ease-in-out motion-reduce:transition-none',
                    '[position-try-fallbacks:flip-block,flip-inline] [--nook-align:center]',
                    'data-[side=top]:[position-area:block-start_var(--nook-align)]',
                    'data-[side=top]:mbe-2 data-[side=bottom]:[position-area:block-end_var(--nook-align)] data-[side=bottom]:mbs-2',
                    'data-[side=left]:[position-area:inline-start_var(--nook-align)] data-[side=left]:me-2 data-[side=right]:[position-area:inline-end_var(--nook-align)] data-[side=right]:ms-2',
                    'data-[align=start]:[--nook-align:span-inline-end] data-[align=end]:[--nook-align:span-inline-start]',
                    'data-[side=left]:data-[align=start]:[--nook-align:span-block-end]',
                    'data-[side=left]:data-[align=end]:[--nook-align:span-block-start]',
                    'data-[side=right]:data-[align=start]:[--nook-align:span-block-end]',
                    'data-[side=right]:data-[align=end]:[--nook-align:span-block-start]',
                    panelProps?.className
                )}
                data-side={side}
                data-align={align}
            >
                {title ? (
                    <h2
                        {...popover.titleProps}
                        className="nook-popover__title m-0 mb-1 text-base font-semibold tracking-tight"
                    >
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
