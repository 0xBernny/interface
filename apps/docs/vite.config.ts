import { defineConfig } from "vite"
import mdx from "@mdx-js/rollup"
import remarkFrontmatter from "remark-frontmatter"
import remarkMdxFrontmatter from "remark-mdx-frontmatter"
import { shikiPlugin } from "./src/lib/rehype-shiki"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  root: import.meta.dirname,
  plugins: [
    mdx({
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
      rehypePlugins: [shikiPlugin],
    }),
    tailwindcss(),
  ],
  build: {
    outDir: ".nitro-static",
    emptyOutDir: false,
  },
})
