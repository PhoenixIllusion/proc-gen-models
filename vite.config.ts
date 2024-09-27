import { defineConfig } from 'vite'
import { visualizer } from "rollup-plugin-visualizer";
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [
    solidPlugin(),
    //visualizer(),
  ],
  build: {
    rollupOptions: {
      external: [/^three.*/, /solid-js.*/],
    }
  }
})