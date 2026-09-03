import { defineConfig } from 'vite';
import { sites } from '@openai/sites-vite-plugin';

export default defineConfig({
  plugins: [
    sites(),
    {
      name: 'playground-worker-entry',
      generateBundle() {
        this.emitFile({
          type: 'asset',
          fileName: 'server/index.js',
          source: `export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404) return response;
    const url = new URL(request.url);
    if (!url.pathname.includes('.')) {
      return env.ASSETS.fetch(new Request(new URL('/index.html', url), request));
    }
    return response;
  }
};\n`,
        });
      },
    },
  ],
});
