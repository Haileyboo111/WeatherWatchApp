import { defineConfig } from 'vitest/config';
import viteReact from '@vitejs/plugin-react';

export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTests.js',
    },
});