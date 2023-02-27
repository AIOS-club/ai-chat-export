import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import hotReloadContent from "./script/hot-reload/content";
import { isDev, outputDir } from "./const";

export const resolvePath = (...args: string[]) =>
  path.resolve(__dirname, ".", ...args);

export const commonConfig = {
  root: resolvePath("src"),
  plugins: [vue()],
  resolve: {
    alias: {
      "~/": `${resolvePath("src")}/`,
    },
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  ...commonConfig,
  build: {
    watch: isDev ? {} : null,
    cssCodeSplit: false,
    emptyOutDir: false,
    sourcemap: false,
    outDir: resolvePath(outputDir),
    rollupOptions: {
      input: {
        contentScript: resolvePath("src/contentScript/index.ts"),
      },
      output: {
        assetFileNames: "[name].[ext]",
        entryFileNames: "[name]/index.js",
        extend: true,
        format: "iife",
      },
    },
  },
  plugins: [...commonConfig.plugins, hotReloadContent()],
});
