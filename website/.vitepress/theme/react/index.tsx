import { StrictMode, type ComponentType } from 'react'
import { createRoot } from 'react-dom/client'
import { AnimationDemo } from './AnimationDemo'
import { CombinedDemo } from './CombinedDemo'
import { ControlledDemo } from './ControlledDemo'
import { HeroDemo } from './HeroDemo'
import { PlacementDemo } from './PlacementDemo'
import { PopoverDemo } from './PopoverDemo'
import { TooltipDemo } from './TooltipDemo'

export const demos = {
    animation: AnimationDemo,
    combined: CombinedDemo,
    controlled: ControlledDemo,
    hero: HeroDemo,
    placement: PlacementDemo,
    popover: PopoverDemo,
    tooltip: TooltipDemo
} satisfies Record<string, ComponentType>

export type DemoName = keyof typeof demos

/** Mounts a demo into a host element in StrictMode. Returns an unmount function. */
export function mountDemo(host: HTMLElement, name: DemoName): () => void {
    const Component = demos[name]
    const root = createRoot(host)
    root.render(
        <StrictMode>
            <Component />
        </StrictMode>
    )
    return () => root.unmount()
}
