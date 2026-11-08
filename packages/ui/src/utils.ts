export type Side = 'top' | 'bottom' | 'left' | 'right'
export type Align = 'start' | 'center' | 'end'

export function classNames(...names: unknown[]): string {
    return names.filter((name) => typeof name === 'string' && name.length > 0).join(' ')
}
