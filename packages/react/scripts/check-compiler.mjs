/**
 * Reports what React Compiler did with each source file and fails when an
 * exported hook was not compiled, unless it is listed in `exceptions` with a reason.
 *
 * The published build keeps `panicThreshold: 'none'` as React recommends. This
 * check makes skipped code visible so it can be triaged: compiler diagnostics
 * can be false positives, so a skip is a prompt to investigate, not a verdict.
 */
import { transformFileAsync } from '@babel/core'
import { readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

/** Exported hooks that are intentionally not compiled, with the reason. */
const exceptions = {
    // useExample: 'Reason, and a link to an upstream issue if one exists.'
}

const srcDir = fileURLToPath(new URL('../src/', import.meta.url))
const files = readdirSync(srcDir).filter((file) => file.endsWith('.ts'))

const compiled = new Set()
const findings = []
const exported = new Set()

for (const file of files) {
    const path = srcDir + file
    const result = await transformFileAsync(path, {
        configFile: false,
        babelrc: false,
        presets: [['@babel/preset-typescript', { onlyRemoveTypeImports: true }]],
        plugins: [
            [
                'babel-plugin-react-compiler',
                {
                    target: '19',
                    panicThreshold: 'none',
                    logger: {
                        logEvent(_filename, event) {
                            if (event.kind === 'CompileSuccess') {
                                compiled.add(event.fnName)
                                return
                            }
                            findings.push({ file, kind: event.kind, detail: describe(event) })
                        }
                    }
                }
            ]
        ]
    })

    for (const match of result.code.matchAll(/export function (use[A-Z]\w*)/g)) {
        exported.add(match[1])
    }
}

function describe(event) {
    const detail = event.detail ?? event.data ?? event
    try {
        return typeof detail === 'string' ? detail : JSON.stringify(detail, null, 2).slice(0, 800)
    } catch {
        return String(detail)
    }
}

console.log(`Compiled: ${[...compiled].sort().join(', ') || 'nothing'}`)

if (findings.length > 0) {
    console.log('\nCompiler events to triage:')
    for (const finding of findings) {
        console.log(`- ${finding.file} [${finding.kind}] ${finding.detail}`)
    }
}

const skipped = [...exported].filter((name) => !compiled.has(name))
const unexplained = skipped.filter((name) => !(name in exceptions))

for (const name of skipped.filter((name) => name in exceptions)) {
    console.log(`\nSkipped by exception: ${name} (${exceptions[name]})`)
}

if (unexplained.length > 0) {
    console.error(`\nExported hooks not compiled: ${unexplained.join(', ')}`)
    console.error(
        'Triage the events above. Fix real Rules of React violations; record justified false positives in `exceptions`.'
    )
    process.exit(1)
}

console.log(`\nAll ${exported.size} exported hooks compiled.`)
