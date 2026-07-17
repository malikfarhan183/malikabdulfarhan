const {spawn} = require('node:child_process');
const path = require('node:path');

const appRoot = path.resolve(__dirname, '..');

const children = [
  spawn(process.execPath, ['scripts/build.js'], {
    cwd: appRoot,
    stdio: 'inherit',
    env: process.env,
  }),
];

children[0].on('exit', (code) => {
  if (code !== 0) {
    process.exit(code || 1);
  }

  const server = spawn(process.execPath, ['dist/api/index.js'], {
    cwd: appRoot,
    stdio: 'inherit',
    env: {...process.env, PORT: process.env.PORT || '4200'},
  });

  children.push(server);
});

function shutdown() {
  for (const child of children) {
    child.kill('SIGTERM');
  }
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
