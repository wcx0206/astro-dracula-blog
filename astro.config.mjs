// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';
import markdownIntegration from '@astropub/md'
import preact from "@astrojs/preact";

import { remarkDescPlugin } from "./src/scripts/markdown.ts";

// https://astro.build/config
export default defineConfig({
  markdown: {
    shikiConfig: {
      theme: "dracula",
      wrap: true,
      langAlias: {
        "C": "c",
        "zshrc": "zsh",
      }
    },
    remarkPlugins: [remarkDescPlugin],
  },
  integrations: [tailwind(), markdownIntegration(), preact()]
});