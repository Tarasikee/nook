import { readFile } from 'node:fs/promises'
import { codeToHtml } from 'shiki'
import type { Plugin } from 'vite'

const prefix = '\0nook-source:'

// The virtual id must not end in `.css`, `.ts`, or `.tsx`: in dev, Vite would treat it as a
// stylesheet (appending `?import` and running its CSS pipeline) or as TypeScript. Encoding the
// path and ending the id in `.js` keeps it a plain module in both dev and build.
const encode = (file: string) => `${prefix}${Buffer.from(file).toString('base64url')}.js`
const decode = (id: string) => Buffer.from(id.slice(prefix.length, -'.js'.length), 'base64url').toString('utf8')

const languages: [suffix: string, lang: string][] = [
    ['.css', 'css'],
    ['.tsx', 'tsx'],
    ['.ts', 'ts']
]

/**
 * `import source from './File.tsx?source'` returns `{ lang, html }`: that file's source highlighted
 * with Shiki at build time, using the same themes and markup as VitePress code blocks. The path
 * resolves like any import, so aliases such as `@nook/ui/button.css?source` work.
 */
export function sourcePlugin(): Plugin {
    return {
        name: 'nook-source',
        enforce: 'pre',
        async resolveId(id, importer) {
            const match = /^(.*)\?source$/.exec(id)
            if (!match || !importer) {
                return null
            }
            const resolved = await this.resolve(match[1], importer, { skipSelf: true })
            if (!resolved) {
                throw new Error(`Cannot resolve ${match[1]} from ${importer}`)
            }
            return encode(resolved.id)
        },
        async load(id) {
            if (!id.startsWith(prefix)) {
                return null
            }
            const file = decode(id)
            const lang = languages.find(([suffix]) => file.endsWith(suffix))?.[1]
            if (!lang) {
                throw new Error(`No highlighting language for ${file}`)
            }
            this.addWatchFile(file)
            const source = await readFile(file, 'utf8')
            const html = await codeToHtml(source.trim(), {
                lang,
                themes: { light: 'github-light', dark: 'github-dark' },
                defaultColor: false
            })
            // VitePress styles `.vp-code` blocks; drop Shiki's inline background.
            const code = html.replace(/^<pre class="([^"]*)" style="[^"]*"/, '<pre class="$1 vp-code"')
            return `export default ${JSON.stringify({ lang, html: code })}`
        }
    }
}
