import { Button, Popover, PopoverClose, Tooltip } from '@nook/ui-react'
import { Demo, Icon, useUnsupported } from '../shared'

export function PopoverDemo() {
    const unsupported = useUnsupported(['popover'])

    return (
        <Demo
            title="Popover"
            badge="<Popover>"
            hint="Share opens a popover. The ⋯ button has a tooltip on hover and a popover on click."
            unsupported={unsupported}
        >
            <Popover
                title="Invite collaborators"
                content={
                    <>
                        <p style={{ margin: 0 }}>Anyone with the link can view this project.</p>
                        <div className="nook-popover__actions">
                            <PopoverClose>Done</PopoverClose>
                        </div>
                    </>
                }
            >
                <Button variant="primary">
                    <Icon name="share" size={16} />
                    Share
                </Button>
            </Popover>

            <Tooltip label="Project actions" asLabel>
                <Popover title="Project actions" content={<p style={{ margin: 0 }}>One button, two behaviors.</p>}>
                    <Button icon>
                        <Icon name="more" />
                    </Button>
                </Popover>
            </Tooltip>
        </Demo>
    )
}
