'use client'

import type { ComponentProps } from 'react'
import { classNames } from './utils'
import type { Align, Side } from './utils'

export type { Align, Side } from './utils'

export type TooltipBodyProps = ComponentProps<'div'> & { side?: Side; align?: Align }

export function TooltipBody({
    side = 'top',
    align = 'center',
    popover = 'hint',
    role = 'tooltip',
    className,
    ...props
}: TooltipBodyProps) {
    return (
        <div
            {...props}
            popover={popover}
            role={role}
            data-side={side}
            data-align={align}
            className={classNames(
                'nook-tooltip box-border inset-auto m-0 rounded-md border-0 bg-slate-900 px-3 py-1.5 font-sans text-xs font-medium whitespace-nowrap text-white shadow-lg dark:bg-slate-100 dark:text-slate-900',
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
                className
            )}
        />
    )
}

export type TooltipGroupProps = ComponentProps<'div'>

export function TooltipGroup({ className, ...props }: TooltipGroupProps) {
    return (
        <div
            {...props}
            className={classNames(
                'nook-tooltip-group [&:has(:interest-source)_[interestfor]]:[interest-delay-start:0s]',
                className
            )}
        />
    )
}
