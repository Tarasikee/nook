export function nookIdentifier({ debugId, filePath }: { debugId?: string; filePath: string }): string {
    if (!debugId) {
        throw new Error(`${filePath}: name every @nook/ui style, as in style({...}, 'button').`)
    }
    return `nook-${debugId}`
}
