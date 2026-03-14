import { defineConfig } from "./terminal/index.ts"

export default defineConfig({
  description: "Custom description",
  setupProgram: program => {
    program.name("test")
  },
})
