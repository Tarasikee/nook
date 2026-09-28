import { createPopover, createTooltip } from "@nook/core"
import "./style.css"

function requiredElement<ElementType extends HTMLElement>(id: string) {
    const element = document.getElementById(id)

    if (!element) {
        throw new Error(`Missing example element: #${id}`)
    }

    return element as ElementType
}

const shareTrigger = requiredElement<HTMLButtonElement>("share-trigger")
const sharePopover = requiredElement<HTMLElement>("share-popover")
const shareLog = requiredElement<HTMLElement>("share-log")
const archiveTrigger = requiredElement<HTMLButtonElement>("archive-trigger")
const archiveTooltip = requiredElement<HTMLElement>("archive-tooltip")

let shareClicks = 0

shareTrigger.addEventListener("click", () => {
    shareClicks += 1
    shareLog.textContent = `${shareClicks} ${shareClicks === 1 ? "click" : "clicks"} recorded by your app`
})

createPopover({
    content: sharePopover,
    trigger: shareTrigger,
})

createTooltip({
    content: archiveTooltip,
    trigger: shareTrigger,
})

createTooltip({
    content: archiveTooltip,
    trigger: archiveTrigger,
})
