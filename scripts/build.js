const {spawnSync} = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const appRoot = path.resolve(__dirname, '..');
const distRoot = path.resolve(appRoot, 'dist');
const publicDist = path.resolve(distRoot, 'public');
const serverDist = path.resolve(distRoot, 'server');

run(process.execPath, ['scripts/run-tsc.js', '-p', 'apps/api/tsconfig.json']);
run(process.execPath, ['scripts/run-vite.js', 'build', '--config', 'apps/web/vite.config.js']);
writeDeploymentHandler();

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: appRoot,
    stdio: 'inherit',
    env: process.env,
  });

  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

function writeDeploymentHandler() {
  fs.rmSync(serverDist, {recursive: true, force: true});
  fs.mkdirSync(serverDist, {recursive: true});

  const assets = collectStaticAssets(publicDist);
  const demoData = require(path.resolve(distRoot, 'api', 'providers', 'demoData.js'));
  const source = createHandlerSource(assets, demoData);

  fs.writeFileSync(path.resolve(serverDist, 'index.js'), source, 'utf8');
}

function collectStaticAssets(rootDir) {
  const assets = {};

  function visit(directory) {
    for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
      const absolutePath = path.resolve(directory, entry.name);

      if (entry.isDirectory()) {
        visit(absolutePath);
        continue;
      }

      const relativePath = `/${path.relative(rootDir, absolutePath).replace(/\\/g, '/')}`;
      const contentType = getContentType(absolutePath);
      const isText = contentType.startsWith('text/') || contentType.includes('javascript');

      assets[relativePath] = isText
        ? {type: contentType, content: fs.readFileSync(absolutePath, 'utf8')}
        : {type: contentType, base64: fs.readFileSync(absolutePath).toString('base64')};
    }
  }

  visit(rootDir);
  assets['/'] = assets['/index.html'];
  return assets;
}

function getContentType(filePath) {
  const extension = path.extname(filePath).toLowerCase();

  return (
    {
      '.css': 'text/css; charset=utf-8',
      '.html': 'text/html; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8',
      '.png': 'image/png',
      '.svg': 'image/svg+xml',
      '.webp': 'image/webp',
    }[extension] || 'application/octet-stream'
  );
}

function createHandlerSource(assets, demoData) {
  return `const assets = ${JSON.stringify(assets)};
const demoUsers = ${JSON.stringify(demoData.DEMO_USERS)};
const demoProjects = ${JSON.stringify(demoData.DEMO_PROJECTS)};
const demoAuditEvents = ${JSON.stringify(demoData.DEMO_AUDIT_EVENTS)};
const jwtSecret = 'hosted-demo-secret';
const encoder = new TextEncoder();

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store'},
  });
}

function getBody(request) {
  return request.json().catch(() => ({}));
}

async function signToken(payload) {
  const header = base64Url(JSON.stringify({alg: 'HS256', typ: 'JWT'}));
  const body = base64Url(JSON.stringify({...payload, exp: Math.floor(Date.now() / 1000) + 3600}));
  const signature = await hmac(header + '.' + body);
  return header + '.' + body + '.' + signature;
}

async function verifyToken(token) {
  const [header, body, signature] = token.split('.');
  if (!header || !body || !signature) {
    return null;
  }
  const expected = await hmac(header + '.' + body);
  if (expected !== signature) {
    return null;
  }
  const payload = JSON.parse(atob(base64UrlToBase64(body)));
  return payload.exp > Math.floor(Date.now() / 1000) ? payload : null;
}

async function hmac(value) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(jwtSecret), {name: 'HMAC', hash: 'SHA-256'}, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(value));
  return base64UrlBytes(new Uint8Array(signature));
}

function base64Url(value) {
  return btoa(value).replace(/=/g, '').replace(/\\+/g, '-').replace(/\\//g, '_');
}

function base64UrlBytes(bytes) {
  let value = '';
  for (const byte of bytes) {
    value += String.fromCharCode(byte);
  }
  return btoa(value).replace(/=/g, '').replace(/\\+/g, '-').replace(/\\//g, '_');
}

function base64UrlToBase64(value) {
  return value.replace(/-/g, '+').replace(/_/g, '/');
}

function getBearerToken(request) {
  const header = request.headers.get('authorization') || '';
  return header.startsWith('Bearer ') ? header.slice(7) : '';
}

function getProjectSummary() {
  const activeProjects = demoProjects.filter((project) => project.status === 'active').length;
  const totalBudget = demoProjects.reduce((sum, project) => sum + project.budget, 0);
  const averageHealth = Math.round(demoProjects.reduce((sum, project) => sum + project.healthScore, 0) / demoProjects.length);
  return {activeProjects, totalBudget, averageHealth, apiLatency: 42};
}

function getAssetResponse(asset) {
  if (asset.base64) {
    const binary = atob(asset.base64);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    return new Response(bytes, {headers: {'content-type': asset.type, 'cache-control': 'public, max-age=31536000, immutable'}});
  }
  return new Response(asset.content, {headers: {'content-type': asset.type, 'cache-control': asset.type.startsWith('text/html') ? 'no-store' : 'public, max-age=31536000, immutable'}});
}

async function requireUser(request) {
  const payload = await verifyToken(getBearerToken(request));
  return payload ? demoUsers.find((user) => user.id === payload.sub) : null;
}

async function handleRequest(request) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === '/api/auth/login' && request.method === 'POST') {
    const body = await getBody(request);
    const user = demoUsers.find((item) => item.email === body.email && body.password === 'Portfolio@2026');
    if (!user) {
      return json({success: false, message: 'Invalid email or password.'}, 401);
    }
    return json({data: {token: await signToken({sub: user.id, role: user.role}), user: getSafeUser(user)}});
  }

  if (path.startsWith('/api/')) {
    const user = await requireUser(request);
    if (!user) {
      return json({success: false, message: 'Unauthorized'}, 401);
    }

    if (path === '/api/auth/me') {
      return json({data: getSafeUser(user)});
    }
    if (path === '/api/dashboard/summary') {
      return json({data: getProjectSummary()});
    }
    if (path === '/api/projects') {
      return json({data: demoProjects, paginationOptions: {page: 1, size: demoProjects.length, totalPages: 1}});
    }
    if (path === '/api/audit-events') {
      return json({data: demoAuditEvents});
    }
    if (path === '/api/system/health') {
      return json({data: {status: 'ok', databaseProvider: 'hosted-demo', optimizedApi: true}});
    }
  }

  return getAssetResponse(assets[path] || assets['/index.html']);
}

function getSafeUser(user) {
  return {id: user.id, name: user.name, email: user.email, role: user.role};
}

export {handleRequest as fetch};
export default {fetch: handleRequest};
`;
}
