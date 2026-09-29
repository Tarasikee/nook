import { transformAsync } from '@babel/core'
import { readFile } from 'node:fs/promises'

// Verifies every benchmark item is compiled by React Compiler, so the comparison stays fair.
let failed = false
for (const lib of ['nook', 'radix', 'floating']) {
    const path = new URL(`./src/${lib}.tsx`, import.meta.url).pathname
    const events = []
    await transformAsync(await readFile(path, 'utf8'), {
        filename: path,
        babelrc: false,
        configFile: false,
        presets: [['@babel/preset-typescript', { isTSX: true, allExtensions: true }]],
        plugins: [
            ['babel-plugin-react-compiler', { target: '19', logger: { logEvent: (_, event) => events.push(event) } }]
        ]
    })
    const compiled = events.filter((event) => event.kind === 'CompileSuccess').map((event) => event.fnName)
    const ok = compiled.includes('Item')
    failed ||= !ok
    console.log(
        `${lib}: ${ok ? 'Item compiled' : 'Item NOT compiled'} (${events.map((event) => event.kind).join(', ')})`
    )
}
process.exit(failed ? 1 : 0)
