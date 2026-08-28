import { defineNitroConfig } from "nitro/config"

export default defineNitroConfig({
  publicAssets: [
    {
      dir: "public",
    },
    {
      dir: ".nitro-static",
    },
  ],
  routeRules: {
    "/**": {
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=86400",
        "Content-Security-Policy": "default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none';"
      }
    },
    "/assets/**": {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    }
  },
  handlers: [
    {
      route: "/old-path",
      handler: "./redirect.ts"
    }
  ]
})
