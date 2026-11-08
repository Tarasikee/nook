import { Button, Dialog } from '@nook/ui'
import { useId } from 'react'
import { Demo } from '../Demo'
import { useUnsupported } from '../shared'

export function DialogDemo() {
    const unsupported = useUnsupported(['command'])
    const id = useId()
    const newsId = useId()
    return (
        <Demo
            title="Dialog"
            badge="<Dialog>"
            hint="Opens modally with no JavaScript. Esc or Cancel closes it; the second one also closes on a backdrop click."
            unsupported={unsupported}
        >
            <Button commandfor={id} command="show-modal" variant="primary">
                Delete project
            </Button>
            <Dialog id={id} aria-labelledby={`${id}-title`}>
                <h2 id={`${id}-title`} className="mb-2 text-lg font-semibold">
                    Delete “Atlas”?
                </h2>
                <p>This removes the project and its history for everyone.</p>
                <div className="mt-6 flex justify-end gap-2">
                    <Button commandfor={id} command="close" variant="ghost" size="small">
                        Cancel
                    </Button>
                    <Button commandfor={id} command="close" variant="primary" size="small">
                        Delete
                    </Button>
                </div>
            </Dialog>
            <Button commandfor={newsId} command="show-modal" variant="ghost">
                What’s new
            </Button>
            <Dialog id={newsId} aria-labelledby={`${newsId}-title`} closedby="any">
                <h2 id={`${newsId}-title`} className="mb-2 text-lg font-semibold">
                    What’s new
                </h2>
                <p>This one also closes when you click outside it.</p>
                <div className="mt-6 flex justify-end gap-2">
                    <Button commandfor={newsId} command="close" variant="ghost" size="small">
                        Close
                    </Button>
                </div>
            </Dialog>
        </Demo>
    )
}
