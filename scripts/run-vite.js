const {spawnSync} = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const appRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(appRoot, '..');
const candidates = [
  path.resolve(appRoot, 'node_modules', 'vite', 'bin', 'vite.js'),
  path.resolve(repoRoot, 'admin-view', 'client', 'node_modules', 'vite', 'bin', 'vite.js'),
];
const viteBin = candidates.find((candidate) => fs.existsSync(candidate));

if (!viteBin) {
  console.error('Vite is not installed. Run npm install, then retry.');
  process.exit(1);
}

const result = spawnSync(process.execPath, [viteBin, ...process.argv.slice(2)], {
  cwd: appRoot,
  stdio: 'inherit',
  env: process.env,
});

process.exit(result.status || 0);
