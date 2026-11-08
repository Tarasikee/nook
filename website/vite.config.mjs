import { transformAsync } from '@babel/core'
import tailwindcss from '@tailwindcss/vite'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const root = fileURLToPath(new URL('.', import.meta.url))
const ui = fileURLToPath(new URL('../packages/ui/src/', import.meta.url))

export default defineConfig({
    root,
    appType: 'mpa',
    resolve: {
        dedupe: ['react', 'react-dom'],
        alias: [
            { find: '@nook/ui/hooks', replacement: `${ui}hooks.ts` },
            { find: /^@nook\/ui$/, replacement: `${ui}index.ts` }
        ]
    },
    optimizeDeps: {
        include: [
            'react',
            'react/jsx-runtime',
            'react/compiler-runtime',
            'react-dom/client',
            'class-variance-authority',
            'clsx',
            'tailwind-merge'
        ]
    },
    plugins: [
        tailwindcss(),
        {
            name: 'react-compiler',
            enforce: 'pre',
            async transform(code, id) {
                if (!/\.tsx?$/.test(id) || id.endsWith('.d.ts') || !(id.startsWith(`${root}src/`) || id.startsWith(ui)))
                    return
                const result = await transformAsync(code, {
                    filename: id,
                    configFile: false,
                    babelrc: false,
                    sourceMaps: true,
                    presets: [
                        ['@babel/preset-typescript', { onlyRemoveTypeImports: true }],
                        ['@babel/preset-react', { runtime: 'automatic' }]
                    ],
                    plugins: [['babel-plugin-react-compiler', { target: '19', panicThreshold: 'none' }]]
                })
                return { code: result.code, map: result.map }
            }
        },
        {
            name: 'pregenerated-react-pages',
            configureServer(server) {
                server.middlewares.use(async (request, response, next) => {
                    const path = new URL(request.url ?? '/', 'http://localhost').pathname
                    if (path !== '/search.json' && (path.startsWith('/@') || path.includes('.'))) return next()
                    try {
                        const renderer = await server.ssrLoadModule('/src/server.tsx')
                        if (path === '/search.json') {
                            response.setHeader('Content-Type', 'application/json')
                            response.end(JSON.stringify(await renderer.searchIndex()))
                            return
                        }
                        const { html, status } = await renderer.renderPage(path, {
                            script: '/src/client.tsx',
                            styles: ['/src/styles.css'],
                            siteUrl: `http://${request.headers.host}`
                        })
                        response.statusCode = status
                        response.setHeader('Content-Type', 'text/html')
                        response.end(await server.transformIndexHtml(path, html))
                    } catch (error) {
                        server.ssrFixStacktrace(error)
                        next(error)
                    }
                })
            },
            configurePreviewServer(server) {
                server.middlewares.use(async (request, response, next) => {
                    const path = new URL(request.url ?? '/', 'http://localhost').pathname
                    if (path.includes('.')) return next()
                    const file = `${root}dist/${path.replace(/^\/+/, '').replace(/\/$/, '')}/index.html`
                    try {
                        const html = await readFile(path === '/' ? `${root}dist/index.html` : file, 'utf8')
                        response.setHeader('Content-Type', 'text/html')
                        response.end(html)
                    } catch (error) {
                        if (error.code !== 'ENOENT' && error.code !== 'ENOTDIR') return next(error)
                        response.statusCode = 404
                        response.setHeader('Content-Type', 'text/html')
                        response.end(await readFile(`${root}dist/404.html`, 'utf8'))
                    }
                })
            }
        }
    ],
    build: {
        outDir: 'dist',
        manifest: true,
        target: 'esnext',
        modulePreload: { polyfill: false },
        rolldownOptions: { input: `${root}src/client.tsx` }
    },
    ssr: { external: ['react', 'react-dom', 'shiki'] }
})
