'use client'

import { createContext, type DialogHTMLAttributes, type ReactElement, type ReactNode, use, useId } from 'react'
import { Button, type ButtonProps } from './Button'
import { cn } from './cn'
import { withTriggerProps } from './utils'

export type DialogProps = {
    content: ReactNode
    title?: ReactNode
    dialogProps?: Omit<DialogHTMLAttributes<HTMLDialogElement>, 'id' | 'open' | 'children'>
    children: ReactElement
}

const DialogContext = createContext<string | null>(null)

export function Dialog({ content, title, dialogProps, children, ...rest }: DialogProps) {
    const id = useId()
    const titleId = `${id}-title`

    return (
        <>
            {withTriggerProps(children, { ...rest, commandfor: id, command: 'show-modal' })}
            <dialog
                {...dialogProps}
                id={id}
                aria-labelledby={title ? titleId : dialogProps?.['aria-labelledby']}
                className={cn(
                    'nook-dialog box-border m-auto w-[min(32rem,calc(100vw-2rem))] max-h-[calc(100vh-2rem)] rounded-lg border border-slate-200 bg-white p-6 text-start font-sans text-sm text-slate-900 shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 backdrop:bg-black/50',
                    'opacity-0 scale-95 open:opacity-100 open:scale-100 starting:open:opacity-0 starting:open:scale-95 transition-[opacity,scale,display,overlay] transition-discrete duration-150 ease-in-out motion-reduce:transition-none',
                    dialogProps?.className
                )}
            >
                {title ? (
                    <h2 id={titleId} className="nook-dialog__title m-0 mb-2 text-lg font-semibold tracking-tight">
                        {title}
                    </h2>
                ) : null}
                <DialogContext value={id}>{content}</DialogContext>
            </dialog>
        </>
    )
}

export function DialogClose({ children = 'Close', ...props }: ButtonProps) {
    const id = use(DialogContext)
    if (!id) {
        throw new Error('Nook UI: DialogClose must be rendered inside Dialog content.')
    }

    return (
        <Button variant="ghost" size="small" {...props} {...{ commandfor: id, command: 'close' }}>
            {children}
        </Button>
    )
}
