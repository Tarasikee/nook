import { Button, Dialog, DialogClose } from '@nook/ui-react'
import { Demo } from '../Demo'
import { useUnsupported } from '../shared'

export function DialogDemo() {
    const unsupported = useUnsupported(['command'])

    return (
        <Demo
            title="Dialog"
            badge="<Dialog>"
            hint="Opens modally with no JavaScript. Esc or Cancel closes it; the second one also closes on a backdrop click."
            unsupported={unsupported}
        >
            <Dialog
                title="Delete “Atlas”?"
                content={
                    <>
                        <p style={{ margin: 0 }}>This removes the project and its history for everyone.</p>
                        <div className="nook-dialog__actions">
                            <DialogClose>Cancel</DialogClose>
                            <DialogClose variant="primary">Delete</DialogClose>
                        </div>
                    </>
                }
            >
                <Button variant="primary">Delete project</Button>
            </Dialog>

            <Dialog
                title="What’s new"
                dialogProps={{ closedby: 'any' }}
                content={
                    <>
                        <p style={{ margin: 0 }}>This one also closes when you click outside it.</p>
                        <div className="nook-dialog__actions">
                            <DialogClose>Close</DialogClose>
                        </div>
                    </>
                }
            >
                <Button variant="ghost">What’s new</Button>
            </Dialog>
        </Demo>
    )
}
