// Compiles the vanilla-extract sources to plain CSS: dist/nook.css (everything) and one file per
// component, plus dist/nook.js with the class names. Run with `node build.ts` (Node 23.6+).
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { basename } from 'node:path'
import { vanillaExtractPlugin } from '@vanilla-extract/esbuild-plugin'
import { build } from 'esbuild'
import { nookIdentifier } from './identifiers.ts'

const entries = ['nook', 'tokens', 'button', 'tooltip', 'popover']

const result = await build({
    entryPoints: Object.fromEntries(entries.map((name) => [name, `src/${name}.css.ts`])),
    bundle: true,
    format: 'esm',
    outdir: 'dist',
    write: false,
    plugins: [vanillaExtractPlugin({ identifiers: nookIdentifier })],
    logLevel: 'warning'
})

await rm('dist', { recursive: true, force: true })
await mkdir('dist')
for (const file of result.outputFiles) {
    const name = basename(file.path)
    // Every entry ships its CSS; only the full entry ships its class names.
    if (name.endsWith('.css') || name === 'nook.js') {
        // Drop esbuild's per-source banner, which names vanilla-extract's virtual files.
        await writeFile(`dist/${name}`, file.text.replace(/^\/\* vanilla-extract-css-ns:.*\*\/\n/gm, ''))
    }
}
