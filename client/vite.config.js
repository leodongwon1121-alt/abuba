import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // GitHub Pages(프로젝트 사이트)는 /<저장소명>/ 하위에서 서빙되므로 빌드 시 base를 넘긴다.
  // 로컬 개발은 그대로 '/'.
  base: process.env.VITE_BASE_PATH || "/",
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:4000",
    },
  },
});
