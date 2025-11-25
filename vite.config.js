import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Adjust base for GitHub Pages; set to repo name.
  base: '/patatap-app/',
  plugins: [react()],
});
