import { AnimationDemo } from './AnimationDemo'
import animation from './AnimationDemo?raw'
import { CombinedDemo } from './CombinedDemo'
import combined from './CombinedDemo?raw'
import { ControlledDemo } from './ControlledDemo'
import controlled from './ControlledDemo?raw'
import { PlacementDemo } from './PlacementDemo'
import placement from './PlacementDemo?raw'
import { PopoverDemo } from './PopoverDemo'
import popover from './PopoverDemo?raw'
import { TooltipDemo } from './TooltipDemo'
import tooltip from './TooltipDemo?raw'
import { ButtonDemo } from './ui/ButtonDemo'
import button from './ui/ButtonDemo?raw'
import { DialogDemo } from './ui/DialogDemo'
import dialog from './ui/DialogDemo?raw'
import { PopoverDemo as UiPopoverDemo } from './ui/PopoverDemo'
import uiPopover from './ui/PopoverDemo?raw'
import { TooltipDemo as UiTooltipDemo } from './ui/TooltipDemo'
import uiTooltip from './ui/TooltipDemo?raw'

export const demos = {
    animation: { Component: AnimationDemo, source: animation },
    combined: { Component: CombinedDemo, source: combined },
    controlled: { Component: ControlledDemo, source: controlled },
    placement: { Component: PlacementDemo, source: placement },
    popover: { Component: PopoverDemo, source: popover },
    tooltip: { Component: TooltipDemo, source: tooltip },
    'ui-button': { Component: ButtonDemo, source: button },
    'ui-dialog': { Component: DialogDemo, source: dialog },
    'ui-popover': { Component: UiPopoverDemo, source: uiPopover },
    'ui-tooltip': { Component: UiTooltipDemo, source: uiTooltip }
}
export type DemoName = keyof typeof demos
