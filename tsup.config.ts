import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    chatbox: "./components/widget/index.tsx",
    api: "./components/api.ts",
    style: "./components/style.tsx",
  },
  format: ["cjs", "esm"],
  clean: true,
  bundle: true,
  dts: true,
});
