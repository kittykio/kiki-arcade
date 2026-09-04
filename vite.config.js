import { defineConfig } from 'vite';
import { sites } from '@openai/sites-vite-plugin';
import { mkdir, writeFile } from 'node:fs/promises';

export default defineConfig({
  plugins: [
    sites(),
    {
      name: 'kiki-world-worker-entry',
      async closeBundle() {
        await mkdir('dist/server', { recursive: true });
        await writeFile('dist/server/index.js', `export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404) return response;
    const url = new URL(request.url);
    if (!url.pathname.includes('.')) {
      return env.ASSETS.fetch(new Request(new URL('/index.html', url), request));
    }
    return response;
  }
};\n`);
      },
    },
  ],
  build: {
    outDir: 'dist/client',
  },
});
