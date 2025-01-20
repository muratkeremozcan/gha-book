const esbuild = require('esbuild')
const { readdirSync } = require('fs')
const { join } = require('path')

// Get all action directories
const actionsDir = join(__dirname, 'actions')
const actions = readdirSync(actionsDir, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name)

// Build each action
Promise.all(
  actions.map((action) =>
    esbuild.build({
      entryPoints: [`actions/${action}/src/${action}.ts`],
      bundle: true,
      platform: 'node',
      target: 'node22',
      outfile: `actions/${action}/dist/${action}.js`,
      external: ['@actions/core']
    })
  )
).catch(() => process.exit(1))
