import { buttonVariants } from '@nook/ui'

export const button = buttonVariants
export const iconButton =
    buttonVariants({ icon: true, variant: 'ghost' }) + ' aria-pressed:bg-emerald-700 aria-pressed:text-white'
export const chip =
    'rounded-full border border-slate-300 bg-white px-3 py-1.5 font-mono text-xs text-slate-600 aria-pressed:border-emerald-600 aria-pressed:bg-emerald-50 aria-pressed:text-emerald-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
export const toolbar =
    'inline-flex gap-1 rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900'
export const row = 'flex flex-wrap items-center gap-2'
export const log =
    'm-0 flex min-w-48 list-none flex-col gap-1 rounded-lg border border-dashed border-slate-300 p-3 font-mono text-xs text-slate-500 dark:border-slate-700'
export const logEmpty = 'text-slate-400'
export const logOpen = 'text-emerald-700 dark:text-emerald-400'
export const state =
    'inline-flex items-center gap-2 font-mono text-xs text-slate-500 before:size-2 before:rounded-full before:bg-slate-400 data-[open]:before:bg-emerald-500'
export const field =
    'mt-3 flex items-center gap-2 rounded-lg border border-slate-200 p-1 pl-3 [&_input]:min-w-0 [&_input]:flex-1 [&_input]:bg-transparent [&_input]:font-mono [&_input]:text-xs dark:border-slate-700'
export const srOnly = 'sr-only'
