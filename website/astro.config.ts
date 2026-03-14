import starlight from "@astrojs/starlight"
import { defineConfig } from "astro/config"
import starlightChangelogs, {
  makeChangelogsSidebarLinks,
} from "starlight-changelogs"
import starlightGitHubAlerts from "starlight-github-alerts"
import starlightScrollToTop from "starlight-scroll-to-top"
import packageJson from "./package.json" with { type: "json" }

const { origin, hostname, pathname } = new URL(packageJson.homepage)
const basedir = import.meta.env.PROD ? pathname : "/"

export default defineConfig({
  site: origin,
  base: basedir,
  srcDir: ".",
  outDir: "build",
  integrations: [
    starlight({
      title: packageJson.title,
      description: packageJson.description,
      customCss: ["/styles/general.css"],
      components: {
        SocialIcons: "./components/builtin/SocialIcons.astro",
      },
      logo: {
        src: "/assets/logo.svg",
        alt: "Logo",
      },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: packageJson.repository,
        },
      ],
      favicon: "favicon.png",
      editLink: {
        baseUrl: `${packageJson.repository}/edit/main`,
      },
      lastUpdated: true,
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 },
      expressiveCode: {
        themes: ["starlight-dark", "starlight-light"],
      },
      plugins: [
        starlightGitHubAlerts(),
        starlightScrollToTop(),
        starlightChangelogs(),
      ],
      sidebar: [
        { label: "Overview", autogenerate: { directory: "overview" } },
        {
          label: "Changelog",
          items: makeChangelogsSidebarLinks([
            {
              type: "recent",
              base: "changelog",
              count: 1,
            },
          ]),
        },
      ],
      head: [
        {
          tag: "script",
          attrs: {
            src: "https://plausible.io/js/script.js",
            "data-domain": hostname.split(".").slice(-2).join("."),
            defer: true,
          },
        },
      ],
    }),
  ],
})
