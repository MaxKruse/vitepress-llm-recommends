import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: "markdown",

  title: "Lithium's LLM Knowledgebase",
  description:
    "A simple way to get recommendations on current community-favourite models.",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [{ text: "Home", link: "/" }],
  },
});
