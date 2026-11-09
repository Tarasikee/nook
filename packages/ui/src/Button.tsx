'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from './cn'

export const buttonVariants = cva(
    [
        'nook-button box-border inline-flex items-center justify-center rounded-md border font-sans font-medium whitespace-nowrap cursor-pointer transition-[color,background-color,border-color,box-shadow] duration-150 ease-in-out',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 data-[open]:shadow-[0_0_0_3px_rgb(56_189_248_/_0.35)] disabled:cursor-not-allowed disabled:opacity-50 forced-colors:border-[ButtonText]'
    ],
    {
        variants: {
            variant: {
                primary: 'border-transparent bg-[#047857] text-white hover:bg-[#065f46]',
                secondary:
                    'border-[#0369a1]/25 bg-sky-400/14 text-[#0369a1] hover:border-[#0369a1] dark:bg-sky-400/16 dark:text-sky-300 dark:hover:border-sky-300',
                ghost: 'border-slate-200 bg-transparent text-slate-600 hover:border-slate-600 hover:text-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-400 dark:hover:text-slate-50'
            },
            size: { medium: 'min-h-9 gap-2 text-sm', small: 'min-h-8 gap-1.5 text-xs' },
            icon: { true: 'px-0', false: null }
        },
        compoundVariants: [
            { size: 'medium', icon: true, className: 'w-9' },
            { size: 'small', icon: true, className: 'w-8' },
            { size: 'medium', icon: false, className: 'px-4' },
            { size: 'small', icon: false, className: 'px-3' }
        ],
        defaultVariants: { variant: 'secondary', size: 'medium', icon: false }
    }
)

// React's DOM types do not yet include native command and interest attributes.
export type ButtonProps = ComponentProps<'button'> &
    VariantProps<typeof buttonVariants> & {
        commandfor?: string
        command?: string
        interestfor?: string
    }

export function Button({
    variant = 'secondary',
    size = 'medium',
    icon = false,
    type = 'button',
    className,
    ...props
}: ButtonProps) {
    return (
        <button
            type={type}
            {...props}
            className={cn(buttonVariants({ variant, size, icon }), className)}
            data-variant={variant}
            data-size={size}
            data-icon={icon ? '' : undefined}
        />
    )
}
