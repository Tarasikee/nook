'use client'

import type { ComponentProps } from 'react'
import { cn } from './cn'
import type { Align, Side } from './utils'

export type PopoverBodyProps = ComponentProps<'div'> & { side?: Side; align?: Align }

export function PopoverBody({
    side = 'bottom',
    align = 'start',
    popover = 'auto',
    className,
    ...props
}: PopoverBodyProps) {
    return (
        <div
            {...props}
            popover={popover}
            data-side={side}
            data-align={align}
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
                className
            )}
        />
    )
}
