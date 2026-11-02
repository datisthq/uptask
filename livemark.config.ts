import { defineConfig } from "livemark"
import packageJson from "./package.json" with { type: "json" }

const { origin, pathname } = new URL(packageJson.homepage)

export default defineConfig({
  site: origin,
  base: command => (command === "build" ? pathname : "/"),
  title: "Uptask",
  description: "Run TS functions from the CLI",
  logo: "/logo.svg",
  favicon: "/logo.png",
  include: ["docs/**/*.md", "CONTRIBUTING.md"],
  sections: [
    { title: "Docs", prefix: "/", icon: "book-open" },
    {
      title: "Changelog",
      prefix: "/changelog/",
      type: "changelog",
      source: "CHANGELOG.md",
      version: true,
      icon: "history",
    },
    {
      title: "GitHub",
      type: "custom",
      url: "https://github.com/datisthq/uptask",
      icon: "github",
    },
  ],
  patches: [
    {
      file: "CONTRIBUTING.md",
      article: {
        title: "Contributing",
        description:
          "How to report bugs and share ideas, and how team members work on Uptask.",
        icon: "heart-handshake",
        path: "/contributing/",
        order: -1,
      },
    },
  ],
})
