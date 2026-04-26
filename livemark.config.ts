import { defineConfig } from "livemark"

export default defineConfig({
  site: "https://uptask.dev",
  title: "Uptask",
  description: "Run TS functions from the CLI",
  include: ["docs/**/*.md", "README.md"],
  sections: [
    { title: "Docs", prefix: "/" },
    {
      title: "Changelog",
      prefix: "/changelog/",
      type: "changelog",
      source: "https://github.com/datisthq/uptask",
      version: true,
    },
  ],
  links: [
    {
      url: "https://github.com/datisthq/uptask",
      title: "GitHub",
      icon: "github",
    },
  ],
  patches: [
    {
      file: "README.md",
      article: {
        title: "Introduction",
        description:
          "Install uptask and turn your first TypeScript file into a CLI.",
        icon: "rocket",
        order: 1,
        path: "/introduction/",
      },
    },
  ],
})
