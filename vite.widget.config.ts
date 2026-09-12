import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

/**
 * Build for the embeddable React widget.
 *
 * `npm run build:widget` referenced this file but it did not exist, so the React
 * widget bundle could not be rebuilt at all - the only copy was a stale artifact
 * checked into dist/.
 *
 * The output goes into public/widget/ rather than dist/ so that:
 *   - the dev server serves /widget/widget.bundle.js at the same path as production
 *   - a normal `npm run build` copies it into dist/ along with the rest of public/
 *
 * It is built as a self-contained IIFE with React bundled in, because the host is
 * an arbitrary third-party page that will not be providing React.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
      '@stores': path.resolve(__dirname, './src/stores'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
  // This is a library build; it must not try to copy public/ into itself.
  publicDir: false,
  define: {
    // The host page has no bundler define step, so this has to be baked in.
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    outDir: 'public/widget',
    emptyOutDir: false, // chat-widget.js and the demo pages live here too
    cssCodeSplit: false,
    lib: {
      entry: path.resolve(__dirname, 'src/apps/chat-widget/widget/entry.tsx'),
      name: 'GetLyncWidget',
      formats: ['iife'],
      fileName: () => 'widget.bundle.js',
    },
    rollupOptions: {
      output: {
        assetFileNames: 'widget.bundle.[ext]',
        inlineDynamicImports: true,
      },
    },
  },
});
