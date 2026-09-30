import * as ui from '@nook/ui'
import { createContext, type DialogHTMLAttributes, type ReactElement, type ReactNode, use, useId } from 'react'
import { Button, type ButtonProps } from './Button'
import { classNames, withTriggerProps } from './merge'

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
                className={classNames(ui.dialog, dialogProps?.className)}
            >
                {title ? (
                    <h2 id={titleId} className={ui.dialogTitle}>
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
