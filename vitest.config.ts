import { basename, dirname, join } from "node:path"
import {
  configDefaults,
  coverageConfigDefaults,
  defineConfig,
} from "vitest/config"

export default defineConfig({
  test: {
    include: ["**/*.unit.(ts|tsx)"],
    exclude: [...configDefaults.exclude, "**/build/**"],
    env: { NODE_OPTIONS: "--no-warnings" },
    testTimeout: 60 * 1000,
    passWithNoTests: true,
    silent: "passed-only",
    coverage: {
      enabled: true,
      reporter: ["html", "json"],
      exclude: [
        ...coverageConfigDefaults.exclude,
        "**/@*",
        "**/build/**",
        "**/compile/**",
        "**/coverage/**",
        "**/entrypoints/**",
        "**/examples/**",
        "**/messages.js",
        "**/program.ts",
        "**/index.ts",
        "**/main.ts",
      ],
    },
    resolveSnapshotPath: (testPath, snapExtension) => {
      return (
        join(dirname(testPath), "fixtures", "generated", basename(testPath)) +
        snapExtension
      )
    },
  },
})
