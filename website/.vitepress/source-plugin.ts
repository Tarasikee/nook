import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { codeToHtml } from 'shiki'
import type { Plugin } from 'vite'

const prefix = '\0nook-source:'

type Request = { file: string; region?: string }

// The virtual id must not end in `.css` or `.tsx`: in dev, Vite would treat it as a stylesheet
// (appending `?import` and running its CSS pipeline) or as TSX. Encoding the request and ending
// the id in `.js` keeps it a plain module in both dev and build.
const encode = (request: Request) => `${prefix}${Buffer.from(JSON.stringify(request)).toString('base64url')}.js`
const decode = (id: string): Request =>
    JSON.parse(Buffer.from(id.slice(prefix.length, -'.js'.length), 'base64url').toString('utf8'))

/**
 * `import html from './File.tsx?source'` returns that file's source highlighted with Shiki at build
 * time, using the same themes and markup as VitePress code blocks. `?source=name` on a CSS file
 * returns only the `#region name` … `#endregion name` part.
 */
export function sourcePlugin(): Plugin {
    return {
        name: 'nook-source',
        enforce: 'pre',
        resolveId(id, importer) {
            const match = /^(.*)\?source(?:=([\w-]+))?$/.exec(id)
            if (!match || !importer) {
                return null
            }
            return encode({ file: resolve(dirname(importer), match[1]), region: match[2] })
        },
        async load(id) {
            if (!id.startsWith(prefix)) {
                return null
            }
            const { file, region } = decode(id)
            this.addWatchFile(file)
            const source = await readFile(file, 'utf8')
            const code = region ? extractRegion(source, region, file) : source
            const html = await codeToHtml(code.trim(), {
                lang: file.endsWith('.css') ? 'css' : 'tsx',
                themes: { light: 'github-light', dark: 'github-dark' },
                defaultColor: false
            })
            // VitePress styles `.vp-code` blocks; drop Shiki's inline background.
            return `export default ${JSON.stringify(html.replace(/^<pre class="([^"]*)" style="[^"]*"/, '<pre class="$1 vp-code"'))}`
        }
    }
}

function extractRegion(source: string, region: string, file: string) {
    const start = source.indexOf(`/* #region ${region}`)
    const end = source.indexOf(`/* #endregion ${region} */`, start)
    if (start < 0 || end < 0) {
        throw new Error(`Region "${region}" not found in ${file}`)
    }
    return source.slice(source.indexOf('\n', start) + 1, end)
}
