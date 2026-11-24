const fs = require('node:fs');
const path = require('node:path');
const {randomBytes} = require('node:crypto');
const {spawn, spawnSync} = require('node:child_process');
const root = path.resolve(__dirname, '..');
const projects = {api:'backend', web:'frontend/admin-view/frontEnd', mobile:'frontend/user-view/VersionMovil'};
const action = process.argv[2] || 'dev';
const children = new Set();
let stopping = false;

function stopChildren() {
  if (stopping) return;
  stopping = true;
  for (const child of children) {
    if (!child.pid) continue;
    if (process.platform === 'win32') {
      spawnSync('taskkill.exe', ['/PID', String(child.pid), '/T', '/F'], {stdio:'ignore', windowsHide:true});
    } else { child.kill('SIGTERM'); }
  }
}
process.on('SIGINT', () => { stopChildren(); process.exit(130); });
process.on('SIGTERM', () => { stopChildren(); process.exit(143); });
process.on('exit', stopChildren);

function run(args, cwd=root) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, {cwd, stdio:'inherit', env:{...process.env, NG_BUILD_MAX_WORKERS:process.env.NG_BUILD_MAX_WORKERS || '2'}});
    children.add(child);
    child.on('error', reject);
    child.on('close', code => {
      children.delete(child);
      if (code === 0 || stopping) resolve();
      else reject(new Error('El proceso terminó con código ' + code + ': ' + args.join(' ')));
    });
  });
}
function projectPath(name) { return path.join(root, projects[name]); }
function angular(name, args) {
  return run([path.join(projectPath(name),'node_modules/@angular/cli/bin/ng.js'), ...args], projectPath(name));
}
function serve(name) {
  if (!fs.existsSync(path.join(root,'backend/.env.local'))) {
    throw new Error('Falta backend/.env.local. Ejecuta npm run setup y configura tu MariaDB.');
  }
  if (name === 'api') return run(['index.js'], projectPath(name));
  return angular(name, ['serve','--host','127.0.0.1','--port',name==='web'?'4200':'4201','--proxy-config','proxy.conf.json']);
}
async function setup() {
  const npmCli = process.env.npm_execpath;
  if (!npmCli || !fs.existsSync(npmCli)) throw new Error('Ejecuta la preparación con npm run setup.');
  for (const name of Object.keys(projects)) {
    console.log('Instalando dependencias fijadas de ' + name);
    const trustSystem = process.allowedNodeEnvironmentFlags.has('--use-system-ca') ? ['--use-system-ca'] : [];
    await run([...trustSystem,npmCli,'ci','--ignore-scripts','--no-audit','--no-fund','--maxsockets','2'], projectPath(name));
  }
  const envFile = path.join(root,'backend/.env.local');
  if (!fs.existsSync(envFile)) {
    const example = fs.readFileSync(path.join(root,'backend/.env.example'),'utf8');
    fs.writeFileSync(envFile, example.replace('CAMBIA_ESTA_CLAVE_LOCAL',randomBytes(48).toString('base64url')), {flag:'wx'});
    console.log('Creado backend/.env.local con una clave JWT nueva. Configura ahí tu MariaDB.');
  } else { console.log('Conservado backend/.env.local sin cambios.'); }
  console.log('Preparación terminada. Importa database/m4rket_local.sql en tu MariaDB y ejecuta npm start.');
}
async function build(name) { await angular(name,['build','--output-path',path.join(root,'dist',name)]); }
(async () => {
  if (Number(process.versions.node.split('.')[0]) < 20) throw new Error('Se necesita Node 20 o posterior.');
  if (action === 'setup') await setup();
  else if (action === 'dev') await Promise.all(['api','web','mobile'].map(serve));
  else if (projects[action]) await serve(action);
  else if (action === 'build') { await build('web'); await build('mobile'); }
  else if (action === 'build:web') await build('web');
  else if (action === 'build:mobile') await build('mobile');
  else if (action === 'check') await run([path.join(__dirname,'verify-local.cjs')]);
  else throw new Error('Acción desconocida: ' + action);
})().catch(error => { console.error(error.message); stopChildren(); process.exitCode=1; });
