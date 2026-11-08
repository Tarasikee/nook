'use client'

import type { ComponentProps } from 'react'
import { cn } from './cn'

export type DialogProps = ComponentProps<'dialog'>

export function Dialog({ className, ...props }: DialogProps) {
    return (
        <dialog
            {...props}
            className={cn(
                'nook-dialog box-border m-auto w-[min(32rem,calc(100vw-2rem))] max-h-[calc(100vh-2rem)] rounded-lg border border-slate-200 bg-white p-6 text-start font-sans text-sm text-slate-900 shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 backdrop:bg-black/50',
                'opacity-0 scale-95 open:opacity-100 open:scale-100 starting:open:opacity-0 starting:open:scale-95 transition-[opacity,scale,display,overlay] transition-discrete duration-150 ease-in-out motion-reduce:transition-none',
                className
            )}
        />
    )
}
