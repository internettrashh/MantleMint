import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020'
    },
    include: ['@thirdweb-dev/react', '@thirdweb-dev/sdk', 'ethers']
  },
  build: {
    target: 'es2020'
  }
});