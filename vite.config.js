import { defineConfig } from "vite";
const ASSET_URL = process.env.ASSET_URL || "";

export default defineConfig({
  plugins: [],
  base: `${ASSET_URL}/dist/`,
});
