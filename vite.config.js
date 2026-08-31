import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
    base: '/IQOO1/',
    plugins: [react()],
    server: { port: 8000, host: '0.0.0.0' }
});
