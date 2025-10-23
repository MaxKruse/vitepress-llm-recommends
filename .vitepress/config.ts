import { defineConfig } from "vitepress";

export default defineConfig({
  title: "AI Model Guide",
  description: "A practical guide to understanding and using modern AI models.",
  lang: "en-US",

  themeConfig: {
    nav: [
      { text: "Home", link: "/" },
      { text: "Evaluation", link: "/evaluation/" },
      { text: "Inference", link: "/inference/" },
      { text: "Model Types", link: "/model-types/" },
      { text: "Recommendations", link: "/recommendations/" },
    ],

    sidebar: [
      {
        text: "Introduction",
        items: [{ text: "Home", link: "/" }],
      },
      {
        text: "Evaluation",
        items: [{ text: "Overview", link: "/evaluation/" }],
      },
      {
        text: "Inference",
        items: [{ text: "Overview", link: "/inference/" }],
      },
      {
        text: "Model Types",
        collapsed: false,
        items: [
          { text: "Overview", link: "/model-types/" },
          { text: "Dense Models", link: "/model-types/dense/" },
          {
            text: "Mixture of Experts (MoE)",
            link: "/model-types/mixture-of-experts/",
          },
        ],
      },
      {
        text: "Recommendations",
        collapsed: false,
        items: [
          { text: "Overview", link: "/recommendations/" },
          { text: "Coding", link: "/recommendations/coding/" },
          { text: "Instruct-Tuned", link: "/recommendations/instruct/" },
          {
            text: "Personal Assistant",
            link: "/recommendations/personal-assistant/",
          },
          { text: "STEM", link: "/recommendations/stem/" },
          { text: "Storywriting", link: "/recommendations/storywriting/" },
        ],
      },
    ],

    socialLinks: [
      // Add if you have a GitHub, X, etc.
      // { icon: 'github', link: 'https://github.com/your-repo' }
    ],

    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2025 Your Name or Org",
    },
  },

  srcDir: "markdown",
  outDir: "docs",
  base: "/vitepress-llm-recommends/",
});
