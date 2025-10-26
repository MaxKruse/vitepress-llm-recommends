import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // register your custom global components
    app.component("ModelSelector");
  },
} satisfies Theme;
