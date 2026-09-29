/**
 * Public names for @nook/ui styles: `style({...}, 'button')` compiles to the class `nook-button`.
 * Plain HTML depends on these names, so every style needs one. Used by `build.ts` and by the
 * website's vanilla-extract plugin, so the site renders the same class names that ship.
 */
export function nookIdentifier({ debugId, filePath }: { debugId?: string; filePath: string }): string {
    if (!debugId) {
        throw new Error(`${filePath}: name every @nook/ui style, as in style({...}, 'button').`)
    }
    return `nook-${debugId}`
}
