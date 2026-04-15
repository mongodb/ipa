import type { Config } from "@docusaurus/types";
import type {
  Options as PresetClassicOptions,
  ThemeConfig,
} from "@docusaurus/preset-classic";
import { themes } from "prism-react-renderer";
import parseFrontMatter from "./src/plugins/parseIpaFrontMatter";

const config: Config = {
  title: "IPA - Improvement Proposal for APIs",
  url: "https://mongodb.github.io", // Your website URL
  baseUrl: "/ipa/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "mongodb",
  projectName: "ipa", // Usually your repo name.
  presets: [
    [
      "classic",
      {
        docs: {
          path: "ipa", // Use ipa/ as docs root
          routeBasePath: "/", // Serve docs at site root
          sidebarPath: require.resolve("./sidebars.ts"),
          editUrl: undefined,
        },
        blog: false,
        theme: {},
      } satisfies PresetClassicOptions,
    ],
  ],

  markdown: {
    parseFrontMatter,
  },

  plugins: [
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      {
        // ... Your options.
        // `hashed` is recommended as long-term-cache of index file is possible.
        hashed: true,
        // For Docs using Chinese, The `language` is recommended to set to:
        // ```
        // language: ["en", "zh"],
        // ```
        // When applying `zh` in language, please install `nodejieba` in your project.
        indexDocs: true,
        indexBlog: false,
        indexPages: false,
        docsRouteBasePath: "/",
        highlightSearchTermsOnTargetPage: true,
        searchResultLimits: 8,
        searchResultContextMaxLength: 50,
        explicitSearchResultPath: true,
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: "IPA - Improvement Proposal for APIs",
      items: [
        {
          type: "doc",
          docId: "index",
          position: "left",
          label: "IPA Docs",
        },
        {
          href: "https://github.com/mongodb/ipa",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Documentation",
          items: [
            {
              label: "General Guidelines",
              to: "/1",
            },
            {
              label: "SDK Guidelines",
              to: "/900",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "GitHub Issues",
              href: "https://github.com/mongodb/ipa/issues",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/mongodb/ipa",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} MongoDB, Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: themes.github,
      darkTheme: themes.dracula,
    },
  } satisfies ThemeConfig,
};

export default config;
