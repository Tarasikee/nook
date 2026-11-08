import { Button, PopoverBody, TooltipBody, TooltipGroup } from '@nook/ui'
import { usePopover, useTooltip } from '@nook/ui/hooks'
import { useState } from 'react'
import { Icon } from './shared'

const people = [
    { initials: 'AK', name: 'Ana Kovač', role: 'Owner' },
    { initials: 'JM', name: 'Jonas Meyer', role: 'Editor' },
    { initials: 'SL', name: 'Sara Lind', role: 'Viewer' }
]

export function HeroDemo() {
    const [clicks, setClicks] = useState(0)
    const [starred, setStarred] = useState(false)
    const [last, setLast] = useState('Ready when you are')
    const share = usePopover()
    const star = useTooltip({ role: 'label' })
    const archive = useTooltip({ role: 'label' })
    return (
        <div className="relative rounded-2xl border border-slate-200 bg-white shadow-[0_20px_80px_-30px_rgb(15_23_42_/_0.25)] dark:border-slate-700 dark:bg-slate-900">
            <div
                className="flex items-center gap-1.5 border-b border-slate-100 px-5 py-3 dark:border-slate-800"
                aria-hidden="true"
            >
                <span className="size-2 rounded-full bg-slate-200" />
                <span className="size-2 rounded-full bg-slate-200" />
                <span className="size-2 rounded-full bg-slate-200" />
                <span className="ml-auto font-mono text-[10px] text-slate-400">atlas.app / roadmap</span>
            </div>
            <div className="p-6 sm:p-8">
                <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-slate-400">Workspace / Atlas</p>
                <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
                    <h2 className="text-xl font-semibold tracking-tight">Product roadmap</h2>
                    <TooltipGroup className="flex items-center gap-1">
                        <Button
                            {...star.triggerProps}
                            icon
                            variant="ghost"
                            aria-pressed={starred}
                            onClick={() => setStarred(!starred)}
                        >
                            <Icon name="star" size={16} />
                        </Button>
                        <TooltipBody {...star.contentProps}>{starred ? 'Unstar project' : 'Star project'}</TooltipBody>
                        <Button {...archive.triggerProps} icon variant="ghost">
                            <Icon name="archive" size={16} />
                        </Button>
                        <TooltipBody {...archive.contentProps}>Archive project</TooltipBody>
                        <Button {...share.triggerProps} variant="primary" onClick={() => setClicks(clicks + 1)}>
                            <Icon name="share" size={15} />
                            Share
                        </Button>
                        <PopoverBody
                            {...share.contentProps}
                            onToggle={(event) => setLast(`onToggle(${event.newState})`)}
                        >
                            <h2 {...share.titleProps} className="mb-1 text-base font-semibold">
                                Share “Product roadmap”
                            </h2>
                            <ul className="my-4 space-y-3">
                                {people.map((person) => (
                                    <li key={person.initials} className="flex items-center gap-3">
                                        <span className="grid size-8 place-items-center rounded-full bg-emerald-100 text-[10px] font-semibold text-emerald-800">
                                            {person.initials}
                                        </span>
                                        <span className="text-xs">{person.name}</span>
                                        <span className="ml-auto text-[10px] text-slate-400">{person.role}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-4 flex justify-end">
                                <Button {...share.closeProps} variant="ghost" size="small">
                                    Done
                                </Button>
                            </div>
                        </PopoverBody>
                    </TooltipGroup>
                </div>
                <ul className="space-y-4" aria-hidden="true">
                    {[
                        ['Design system', 'In progress'],
                        ['Public registry', 'Shipped'],
                        ['Native menus', 'Planned'],
                        ['Customizable select', 'Planned']
                    ].map(([name, status]) => (
                        <li
                            key={name}
                            className="flex items-center gap-3 border-b border-slate-100 pb-4 text-xs dark:border-slate-800"
                        >
                            <span
                                className={`size-2 rounded-full ${status === 'Shipped' ? 'bg-emerald-500' : 'bg-slate-300'}`}
                            />
                            <span className="text-slate-500">{name}</span>
                            <span className="ml-auto rounded-full bg-slate-100 px-2 py-1 text-[9px] text-slate-500 dark:bg-slate-800">
                                {status}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
            <div
                className="flex flex-wrap justify-between gap-2 border-t border-slate-100 px-6 py-3 font-mono text-[10px] text-slate-400 dark:border-slate-800"
                aria-live="polite"
            >
                <span>your onClick ran {clicks}×</span>
                <span>{last}</span>
            </div>
        </div>
    )
}
