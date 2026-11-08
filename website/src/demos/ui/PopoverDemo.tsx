import { Button, PopoverBody, TooltipBody } from '@nook/ui'
import { usePopover, useTooltip } from '@nook/ui/hooks'
import { Demo } from '../Demo'
import { Icon, useUnsupported } from '../shared'

export function PopoverDemo() {
    const unsupported = useUnsupported(['popover'])
    const share = usePopover()
    const actions = usePopover()
    const hint = useTooltip({ role: 'label' })
    return (
        <Demo
            title="Popover"
            badge="<PopoverBody>"
            hint="Share opens a popover. The ⋯ button has a tooltip on hover and a popover on click."
            unsupported={unsupported}
        >
            <Button {...share.triggerProps} variant="primary">
                <Icon name="share" size={16} />
                Share
            </Button>
            <PopoverBody {...share.contentProps}>
                <h2 {...share.titleProps} className="mb-1 text-base font-semibold">
                    Invite collaborators
                </h2>
                <p>Anyone with the link can view this project.</p>
                <div className="mt-4 flex justify-end gap-2">
                    <Button {...share.closeProps} variant="ghost" size="small">
                        Done
                    </Button>
                </div>
            </PopoverBody>
            <Button {...actions.triggerProps} {...hint.triggerProps} icon>
                <Icon name="more" />
            </Button>
            <TooltipBody {...hint.contentProps}>Project actions</TooltipBody>
            <PopoverBody {...actions.contentProps}>
                <h2 {...actions.titleProps} className="mb-1 text-base font-semibold">
                    Project actions
                </h2>
                <p>One button, two behaviors.</p>
            </PopoverBody>
        </Demo>
    )
}
