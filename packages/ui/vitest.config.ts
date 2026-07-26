import { defineConfig, mergeConfig } from "vitest/config"
import { reactConfig } from "@repo/vitest-config/react"

export default mergeConfig(
  reactConfig,
  defineConfig({
    test: {
      include: ["src/**/*.{test,spec}.{ts,tsx}"],
      setupFiles: ["./setup-tests.ts"],
      deps: {
        inline: [
          "react",
          "react-dom",
          "react/jsx-runtime",
          "react/jsx-dev-runtime",
          "@testing-library/react",
          "@testing-library/user-event",
          "@testing-library/jest-dom",
          "vitest-axe",
        ],
      },
    },
  })
)
