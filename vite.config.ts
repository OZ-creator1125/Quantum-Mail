import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { mkdir, writeFile } from "node:fs/promises";
import { metaImagesPlugin } from "./vite-plugin-meta-images";
import { seoPages } from "./client/src/lib/seoPages";

function generateSitemapPlugin(): Plugin {
  return {
    name: "generate-sitemap",
    async closeBundle() {
      const outDir = path.resolve(import.meta.dirname, "dist", "public");
      const sitemapPath = path.resolve(outDir, "sitemap.xml");

      await mkdir(outDir, { recursive: true });

      const staticUrls = [
        { loc: "https://qmailtemp.com/", priority: "1.0", changefreq: "daily" },
        { loc: "https://qmailtemp.com/privacy", priority: "0.3", changefreq: "monthly" },
        { loc: "https://qmailtemp.com/terms", priority: "0.3", changefreq: "monthly" },
        { loc: "https://qmailtemp.com/contact", priority: "0.3", changefreq: "monthly" },
      ];

      const dynamicUrls = seoPages.map((page) => ({
        loc: `https://qmailtemp.com/${page.slug}`,
        priority: "0.8",
        changefreq: "weekly",
      }));

      const urls = [...staticUrls, ...dynamicUrls];

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

      await writeFile(sitemapPath, xml, "utf8");
      console.log(`✅ sitemap generado: ${sitemapPath}`);
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    metaImagesPlugin(),
    generateSitemapPlugin(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  css: {
    postcss: {
      plugins: [],
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist", "public"),
    emptyOutDir: true,
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
