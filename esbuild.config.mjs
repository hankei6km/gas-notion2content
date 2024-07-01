import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as esbuild from 'esbuild'
import { FilesToLicenses } from '@hankei6km/files-to-licenses'

let fsPolyfillEmptyPlugin = {
  name: 'fs-polyfill-empty-plugin',
  setup(build) {
    build.onResolve({ filter: /^fs$/ }, async (args) => {
      // Only target fs within gray-matter this time
      if (
        args.resolveDir.match(/.+\/gray-matter$/) &&
        args.kind === 'require-call'
      ) {
        return { path: args.path, namespace: 'fs-empty', external: false }
      }
      return undefined
    })
    build.onLoad({ filter: /^fs$/, namespace: 'fs-empty' }, async (args) => {
      return { contents: '', loader: 'js' }
    })
  }
}

const result = await esbuild.build({
  entryPoints: ['src/main.ts'],
  outfile: 'build/main.js',
  //outdir: 'build',
  bundle: true,
  format: 'iife',
  globalName: '_entry_point_',
  sourcemap: false,
  platform: 'node',
  packages:'bundle',
  metafile: true,
  target: 'ES2017',
  tsconfig: 'tsconfig.build.json',
  plugins: [fsPolyfillEmptyPlugin],
  logLevel: 'info'
})

const baseDir = path.dirname(fileURLToPath(import.meta.url))
const opensourceLicensesFilePath = path.join(
  baseDir,
  'build',
  'OPEN_SOURCE_LICENSES.txt'
)

async function* outoutFiles(outputs) {
  for (const [file, { bytes, inputs }] of Object.entries(outputs)) {
    for (const i in inputs) {
      yield path.join(baseDir, i)
    }
  }
}
const filesToLicenses = new FilesToLicenses(
  baseDir,
  outoutFiles(result.metafile.outputs)
)

const opensourceLicensesFile = await fs.open(opensourceLicensesFilePath, 'w')
await opensourceLicensesFile.write('---\n')

for await (const i of filesToLicenses.generate()) {
  await opensourceLicensesFile.write(i)
  await opensourceLicensesFile.write('\n---\n')
}

await opensourceLicensesFile.close()
