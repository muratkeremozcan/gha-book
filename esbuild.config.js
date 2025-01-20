const esbuild = require('esbuild')

esbuild
  .build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    platform: 'node',
    target: 'node22',
    outfile: 'dist/index.js',
    external: ['@actions/core'] // Exclude GitHub Actions toolkit if using them
  })
  .catch(() => process.exit(1))
