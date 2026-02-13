import { defineCollection } from "astro:content"
import { docsLoader } from "@astrojs/starlight/loaders"
import { docsSchema } from "@astrojs/starlight/schema"
import { changelogsLoader } from "starlight-changelogs/loader"
import packageJson from "./package.json" with { type: "json" }

const [owner, repo] = new URL(packageJson.repository).pathname
  .split("/")
  .slice(1)

export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
  changelogs: defineCollection({
    loader: changelogsLoader([
      {
        base: "changelog",
        provider: "github",
        owner,
        repo,
      },
    ]),
  }),
}
