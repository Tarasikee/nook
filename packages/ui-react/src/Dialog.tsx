import * as ui from '@nook/ui'
import { createContext, use, useId, type DialogHTMLAttributes, type ReactElement, type ReactNode } from 'react'
import { Button, type ButtonProps } from './Button.js'
import { classNames, withTriggerProps } from './merge.js'

export type DialogProps = {
    /** The dialog body. Put a `DialogClose` inside for a declarative close button. */
    content: ReactNode
    /** Heading and accessible name; otherwise name the dialog through `dialogProps`. */
    title?: ReactNode
    /** Native dialog attributes, including `closedby="any"` for backdrop dismissal. */
    dialogProps?: Omit<DialogHTMLAttributes<HTMLDialogElement>, 'id' | 'open' | 'children'>
    /** One button (or a component forwarding button attributes). */
    children: ReactElement
}

const DialogContext = createContext<string | null>(null)

/** Modal dialog opened through native button commands; no JavaScript is needed to open or close it. */
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

/** Closes the surrounding Dialog with a native command. Renders a small ghost Button. */
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
