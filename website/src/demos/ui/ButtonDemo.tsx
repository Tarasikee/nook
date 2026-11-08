import { Button, TooltipBody } from '@nook/ui'
import { useTooltip } from '@nook/ui/hooks'
import { Demo } from '../Demo'
import { Icon } from '../shared'

export function ButtonDemo() {
    const tooltip = useTooltip({ role: 'label' })
    return (
        <Demo title="Button" badge="<Button>">
            <Button variant="primary">Save changes</Button>
            <Button>Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button size="small">Small</Button>
            <Button {...tooltip.triggerProps} icon>
                <Icon name="star" />
            </Button>
            <TooltipBody {...tooltip.contentProps}>Star project</TooltipBody>
            <Button disabled>Disabled</Button>
        </Demo>
    )
}
