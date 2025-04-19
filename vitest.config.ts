import { configDefaults, defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    include: ["**/__spec__/*.(ts|tsx)"],
    exclude: ["**/build/**", ...configDefaults.exclude],
    testTimeout: 60 * 1000,
    coverage: {
      enabled: true,
      reporter: ["html"],
    },
  },
})
