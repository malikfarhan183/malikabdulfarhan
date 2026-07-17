const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..', '..');
const repoRoot = path.resolve(projectRoot, '..');
const localModules = path.resolve(projectRoot, 'node_modules');
const fallbackModules = path.resolve(repoRoot, 'admin-view', 'client', 'node_modules');
const dependencyModules = fs.existsSync(path.resolve(localModules, 'react'))
  ? localModules
  : fallbackModules;

function resolveDependency(name) {
  return path.resolve(dependencyModules, ...name.split('/'));
}

module.exports = {
  root: __dirname,
  base: './',
  server: {
    port: Number(process.env.WEB_PORT || 4300),
    proxy: {
      '/api': {
        target: `http://localhost:${process.env.PORT || 4200}`,
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: path.resolve(projectRoot, 'dist', 'public'),
    emptyOutDir: true,
    sourcemap: false,
  },
  resolve: {
    alias: [
      {find: /^react$/, replacement: resolveDependency('react')},
      {find: /^react-dom$/, replacement: resolveDependency('react-dom')},
      {find: /^@mui\/material\/(.*)$/, replacement: `${resolveDependency('@mui/material')}/$1`},
      {find: /^@mui\/material$/, replacement: resolveDependency('@mui/material')},
      {find: /^@mui\/icons-material\/(.*)$/, replacement: `${resolveDependency('@mui/icons-material')}/$1`},
      {find: /^@mui\/icons-material$/, replacement: resolveDependency('@mui/icons-material')},
      {find: /^@emotion\/react\/(.*)$/, replacement: `${resolveDependency('@emotion/react')}/$1`},
      {find: /^@emotion\/react$/, replacement: resolveDependency('@emotion/react')},
      {find: /^@emotion\/styled\/(.*)$/, replacement: `${resolveDependency('@emotion/styled')}/$1`},
      {find: /^@emotion\/styled$/, replacement: resolveDependency('@emotion/styled')},
      {find: /^react-query$/, replacement: resolveDependency('react-query')},
    ],
  },
};
