import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "ryali93.github.io";
const base = process.env.VITE_BASE ?? (repositoryName.endsWith(".github.io") ? "/" : `/${repositoryName}/`);

export default defineConfig({
  base,
  plugins: [react()]
});
