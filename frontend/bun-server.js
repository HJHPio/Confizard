import { serve } from "bun";
const PORT = parseInt(process.env.PORT || Bun.argv[2] || "3000", 10);
const distDir = Bun.fileURLToPath(new URL('./dist', import.meta.url));
serve({
  port: PORT,
  fetch(req) {
    const url = new URL(req.url);
    const filePath = `${distDir}${url.pathname === "/" ? "/index.html" : url.pathname}`;

    try {
      console.log(`Returning file: ${filePath}`);
      return new Response(Bun.file(filePath));
    } catch {
      console.error(`NOT FOUND FILE: ${filePath}`);
      return new Response("404: File not found", { status: 404 });
    }
  },
});
console.info(`Server running on http://localhost:${PORT}`);
