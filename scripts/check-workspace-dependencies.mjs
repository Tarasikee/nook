import { readFile, readdir } from 'node:fs/promises'

const workspaceManifestPaths = [
    'bench/package.json',
    'website/package.json',
    ...(await readdir(new URL('../packages', import.meta.url), { withFileTypes: true }))
        .filter((entry) => entry.isDirectory())
        .map((entry) => `packages/${entry.name}/package.json`)
]

const rootManifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'))
const rootDependencies = new Set(
    ['dependencies', 'devDependencies', 'optionalDependencies'].flatMap((section) =>
        Object.keys(rootManifest[section] ?? {})
    )
)
const installedDependencies = new Map()

for (const manifestPath of workspaceManifestPaths) {
    const manifest = JSON.parse(await readFile(new URL(`../${manifestPath}`, import.meta.url), 'utf8'))

    for (const section of ['dependencies', 'devDependencies', 'optionalDependencies']) {
        for (const dependency of Object.keys(manifest[section] ?? {})) {
            const locations = installedDependencies.get(dependency) ?? []
            locations.push(manifestPath)
            installedDependencies.set(dependency, locations)
        }
    }
}

const repeatedDependencies = [...installedDependencies]
    .filter(([, locations]) => locations.length > 1)
    .filter(([dependency]) => !rootDependencies.has(dependency))

if (repeatedDependencies.length > 0) {
    const details = repeatedDependencies
        .map(([dependency, locations]) => `- ${dependency}: ${locations.join(', ')}`)
        .join('\n')

    throw new Error(`Repeated workspace dependencies must be installed at the root instead:\n${details}`)
}
