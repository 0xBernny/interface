import { defineConfig } from "vite"
import mdx from "@mdx-js/rollup"
import remarkFrontmatter from "remark-frontmatter"
import remarkMdxFrontmatter from "remark-mdx-frontmatter"
import { rehypeMermaid } from "./src/lib/rehype-mermaid"
import { shikiPlugin } from "./src/lib/rehype-shiki"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  root: import.meta.dirname,
  plugins: [
    mdx({
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
      rehypePlugins: [rehypeMermaid, shikiPlugin],
    }),
    tailwindcss(),
  ],
  build: {
    outDir: ".nitro-static",
    emptyOutDir: false,
  },
})
