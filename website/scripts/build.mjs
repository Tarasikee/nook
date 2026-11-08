import { mkdir, readFile, writeFile, rm } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { build } from 'vite'

const root = fileURLToPath(new URL('../', import.meta.url))
const cache = resolve(root, 'node_modules/.cache/nook-prerender')
await build({ root })
await build({
    root,
    build: {
        ssr: 'src/server.tsx',
        outDir: cache,
        manifest: false,
        emptyOutDir: true,
        rolldownOptions: { input: resolve(root, 'src/server.tsx'), output: { entryFileNames: 'server.mjs' } }
    }
})
const { renderPage, pages } = await import(pathToFileURL(resolve(cache, 'server.mjs')).href)
const manifest = JSON.parse(await readFile(resolve(root, 'dist/.vite/manifest.json'), 'utf8'))
const entry = manifest['src/client.tsx']
const siteUrl = process.env.SITE_URL ?? 'http://localhost:4173'
const assets = { script: `/${entry.file}`, styles: (entry.css ?? []).map((file) => `/${file}`), siteUrl }
const index = []

for (const page of [...pages, { path: '/404' }]) {
    const { html, entry: searchEntry } = await renderPage(page.path, assets)
    const file =
        page.path === '/404' ? resolve(root, 'dist/404.html') : resolve(root, 'dist', `.${page.path}`, 'index.html')
    await mkdir(dirname(file), { recursive: true })
    await writeFile(file, html)
    if (page.path !== '/404') index.push(searchEntry)
}
await writeFile(resolve(root, 'dist/search.json'), JSON.stringify(index))
await writeFile(
    resolve(root, 'dist/sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map((page) => `<url><loc>${new URL(page.path, siteUrl).href}</loc></url>`).join('')}</urlset>`
)
await writeFile(
    resolve(root, 'dist/robots.txt'),
    `User-agent: *\nAllow: /\nSitemap: ${new URL('/sitemap.xml', siteUrl).href}\n`
)
await rm(cache, { recursive: true, force: true })
console.log(`Pregenerated ${pages.length} React pages and a 404 page.`)
