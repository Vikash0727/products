import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"; // 👈 Fixed package path
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
