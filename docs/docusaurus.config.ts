import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "Launched Docs",
  tagline: "Finish the site, never look back.",
  favicon: "img/favicon.svg",

  // Set the production url of your site here
  url: "https://docs.launched.tech",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/launchsite-tech/launched/tree/master/docs/",
          routeBasePath: "/",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    // image: "img/docusaurus-social-card.jpg",
    docs: {},
    navbar: {
      logo: {
        alt: "Launched",
        src: "img/favicon.svg",
      },
      items: [
        {
          href: "https://github.com/launchsite-tech/launched",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,

  // themes: ["@docusaurus/theme-mermaid", "@docusaurus/theme-live-codeblock"],
  themes: ["@docusaurus/theme-mermaid"],
  markdown: {
    mermaid: true,
  },
};

export default config;
