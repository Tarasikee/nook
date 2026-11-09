import { AnimationDemo } from './AnimationDemo'
import { CombinedDemo } from './CombinedDemo'
import { ControlledDemo } from './ControlledDemo'
import { PlacementDemo } from './PlacementDemo'
import { PopoverDemo } from './PopoverDemo'
import { TooltipDemo } from './TooltipDemo'
import { ButtonDemo } from './ui/ButtonDemo'
import { DialogDemo } from './ui/DialogDemo'
import { PopoverDemo as UiPopoverDemo } from './ui/PopoverDemo'
import { TooltipDemo as UiTooltipDemo } from './ui/TooltipDemo'
import { examples } from './examples'

export const demos = {
    animation: { Component: AnimationDemo, code: examples.animation },
    combined: { Component: CombinedDemo, code: examples.combined },
    controlled: { Component: ControlledDemo, code: examples.controlled },
    placement: { Component: PlacementDemo, code: examples.placement },
    popover: { Component: PopoverDemo, code: examples.popover },
    tooltip: { Component: TooltipDemo, code: examples.tooltip },
    'ui-button': { Component: ButtonDemo, code: examples['ui-button'] },
    'ui-dialog': { Component: DialogDemo, code: examples['ui-dialog'] },
    'ui-popover': { Component: UiPopoverDemo, code: examples['ui-popover'] },
    'ui-tooltip': { Component: UiTooltipDemo, code: examples['ui-tooltip'] }
}
export type DemoName = keyof typeof demos
