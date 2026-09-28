import { createPopover, createTooltip } from '@nook/core'
import './style.css'

const shareTrigger = document.querySelector<HTMLButtonElement>('#share-trigger')!
const sharePopover = document.querySelector<HTMLElement>('#share-popover')!
const shareLog = document.querySelector<HTMLElement>('#share-log')!
const copyLink = document.querySelector<HTMLButtonElement>('#copy-link')!
const noticeTrigger = document.querySelector<HTMLButtonElement>('#notice-trigger')!
const noticePopover = document.querySelector<HTMLElement>('#notice-popover')!
const noticeClose = document.querySelector<HTMLButtonElement>('#notice-close')!
const archiveTrigger = document.querySelector<HTMLButtonElement>('#archive-trigger')!
const archiveTooltip = document.querySelector<HTMLElement>('#archive-tooltip')!

let shareClicks = 0

shareTrigger.addEventListener('click', () => {
  shareClicks += 1
  shareLog.textContent = `Application click handler ran ${shareClicks} ${shareClicks === 1 ? 'time' : 'times'}.`
})

createPopover({
  content: sharePopover,
  onToggle(isOpen) {
    shareTrigger.setAttribute('aria-expanded', String(isOpen))
  },
  trigger: shareTrigger
})

copyLink.addEventListener('click', async () => {
  const field = sharePopover.querySelector<HTMLInputElement>('input')!

  try {
    await navigator.clipboard.writeText(field.value)
    copyLink.textContent = 'Copied'
  } catch {
    field.select()
    copyLink.textContent = 'Selected'
  }

  window.setTimeout(() => {
    copyLink.textContent = 'Copy'
  }, 1400)
})

createTooltip({
  content: archiveTooltip,
  trigger: archiveTrigger
})

const notice = createPopover({
  content: noticePopover,
  mode: 'manual',
  onToggle(isOpen) {
    noticeTrigger.setAttribute('aria-expanded', String(isOpen))
  },
  trigger: noticeTrigger
})

noticeClose.addEventListener('click', () => {
  notice.hide()
})
