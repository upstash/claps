import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    claps: "./components/claps/claps.tsx",
    api: "./components/claps/api.ts",
    style: "./components/claps/style.tsx",
  },
  format: ["cjs", "esm"],
  clean: true,
  bundle: true,
  dts: true,
  tsconfig: "tsconfig.base.json",
});
