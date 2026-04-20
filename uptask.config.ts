import { defineConfig } from "./index.ts"

export default defineConfig({
  description: "Custom description",
  groups: [{ name: "db", pattern: "@db*.ts" }],
  setupProgram: program => {
    program.name("test")
  },
})
