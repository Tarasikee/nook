import { Button, Tooltip } from '@nook/ui-react'
import { Demo, Icon } from '../shared'

export function ButtonDemo() {
    return (
        <Demo title="Button" badge="<Button>">
            <Button variant="primary">Save changes</Button>
            <Button>Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button size="small">Small</Button>
            <Tooltip label="Star project" asLabel>
                <Button icon>
                    <Icon name="star" />
                </Button>
            </Tooltip>
            <Button disabled>Disabled</Button>
        </Demo>
    )
}
