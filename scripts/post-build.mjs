/**
 * GitHub Pages serves static files only — it has no server-side rewrite, so a
 * deep link like /stays/upstairs-river-house 404s before React Router ever loads.
 *
 * Pages does serve 404.html for any unmatched path, so copying index.html to
 * 404.html makes the SPA boot and the router resolve the URL client-side.
 * .nojekyll stops Pages ignoring the _-prefixed asset files.
 *
 * Runs automatically after `npm run build`.
 */
import { copyFile, writeFile } from 'node:fs/promises';

await copyFile('dist/index.html', 'dist/404.html');
await writeFile('dist/.nojekyll', '');

console.log('post-build: 404.html + .nojekyll written');

// Real 200-status pages per route; 404.html above stays as the safety net for
// anything not in the route list.
await import('./prerender.mjs');
