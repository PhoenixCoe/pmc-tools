// Builds the site as plain static files into /out, ready for GitHub Pages or any static host.
// Pages that need a server (the suggestion form) are set aside, and the form falls back to an email link. Signing in works here: it happens on PMC ID.
import { existsSync, renameSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const api = 'src/app/api';
const aside = 'src/app/_api_off'; // folders starting with _ are ignored by the router
let moved = false;
try {
  if (existsSync(api)) { renameSync(api, aside); moved = true; }
  rmSync('out', { recursive: true, force: true });
  spawnSync('node', ['scripts/fonts.mjs'], { stdio: 'inherit' });
  const r = spawnSync('npx', ['next', 'build'], {
    stdio: 'inherit', shell: true,
    env: { ...process.env, STATIC_EXPORT: '1', NEXT_PUBLIC_STATIC: '1' },
  });
  if (r.status !== 0) process.exitCode = r.status ?? 1;
  else console.log('\nStatic site written to ./out');
} finally {
  if (moved) renameSync(aside, api);
}
