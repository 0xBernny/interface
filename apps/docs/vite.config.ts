import { defineConfig } from "vite"
import mdx from "@mdx-js/rollup"
import remarkFrontmatter from "remark-frontmatter"
import remarkMdxFrontmatter from "remark-mdx-frontmatter"
import { shikiPlugin } from "./src/lib/rehype-shiki"
import tailwindcss from "@tailwindcss/vite"
import { resolve } from "node:path"

export default defineConfig({
  root: import.meta.dirname,
  plugins: [
    mdx({
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
      rehypePlugins: [shikiPlugin],
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@workspace/ui": resolve(import.meta.dirname, "../../packages/ui/src"),
    },
  },
  build: {
    outDir: ".output",
  },
})
