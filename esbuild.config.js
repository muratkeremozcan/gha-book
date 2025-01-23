/* eslint-disable @typescript-eslint/no-require-imports */
const { build } = require('esbuild')
const fs = require('fs')
const path = require('path')

// Only build TypeScript-based actions (skip Docker and composite actions)
const tsActionDirs = ['hello-world', 'goodbye-world']

const entryPoints = tsActionDirs.map((dir) => {
  const actionPath = path.join('actions', dir, 'src', `${dir}.ts`)
  if (!fs.existsSync(actionPath)) {
    throw new Error(`Action source file not found: ${actionPath}`)
  }
  return actionPath
})

Promise.all(
  entryPoints.map((entry) => {
    const outfile = entry.replace('/src/', '/dist/').replace('.ts', '.js')
    return build({
      entryPoints: [entry],
      bundle: true,
      outfile,
      platform: 'node',
      target: 'node20',
      format: 'cjs'
    })
  })
)
  .then(() => console.log('Build complete'))
  .catch(() => process.exit(1))
