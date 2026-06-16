#!/usr/bin/env node
import { build } from 'vite';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const routes = [
  '/',
  '/mais-valias',
  '/taxa-ocupacao',
  '/impostos',
];

async function buildClient() {
  console.log('[SSG] Building client bundle...');
  await build({
    root,
    logLevel: 'warn',
    build: {
      outDir: 'dist',
      ssrManifest: true,
    },
  });
  console.log('[SSG] Client bundle done.');
}

async function buildServer() {
  console.log('[SSG] Building server bundle...');
  await build({
    root,
    logLevel: 'warn',
    build: {
      ssr: 'src/entry-server.tsx',
      outDir: 'dist/server',
      rollupOptions: {
        output: { format: 'esm' },
      },
    },
  });
  console.log('[SSG] Server bundle done.');
}

async function renderRoutes() {
  const templatePath = path.join(root, 'dist', 'index.html');
  const serverEntryPath = path.join(root, 'dist', 'server', 'entry-server.js');

  const template = fs.readFileSync(templatePath, 'utf-8');
  const serverEntry = await import(serverEntryPath);
  const { render } = serverEntry;

  console.log(`[SSG] Rendering ${routes.length} routes...`);

  for (const route of routes) {
    try {
      const { html: appHtml, helmetContext } = render(route);
      const { helmet } = helmetContext;

      let headTags = '';
      if (helmet) {
        headTags = [
          helmet.title?.toString() || '',
          helmet.meta?.toString() || '',
          helmet.link?.toString() || '',
          helmet.script?.toString() || '',
        ].filter(Boolean).join('\n    ');
      }

      let finalHtml = template
        .replace('<!--app-head-->', headTags)
        .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

      let outPath;
      if (route === '/') {
        outPath = path.join(root, 'dist', 'index.html');
      } else {
        const cleanRoute = route.replace(/^\//, '');
        const outDir = path.join(root, 'dist', cleanRoute);
        fs.mkdirSync(outDir, { recursive: true });
        outPath = path.join(outDir, 'index.html');
      }

      fs.writeFileSync(outPath, finalHtml, 'utf-8');
      console.log(`[SSG]   ✓ ${route}`);
    } catch (err) {
      console.error(`[SSG]   ✗ ${route}`, err.message);
    }
  }
}

async function main() {
  console.log('[SSG] Starting static site generation...\n');
  await buildClient();
  await buildServer();
  await renderRoutes();
  console.log('\n[SSG] Build complete!');
}

main().catch((err) => {
  console.error('[SSG] Build failed:', err);
  process.exit(1);
});
