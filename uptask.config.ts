import { defineConfig } from "./index.ts"

export default defineConfig({
  description: "Custom description",
  setupProgram: program => {
    program.name("test")
  },
})
