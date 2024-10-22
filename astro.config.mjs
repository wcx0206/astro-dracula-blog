// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';
import markdownIntegration from '@astropub/md'
import preact from "@astrojs/preact";

import { remarkDesc } from "./src/scripts/remark-desc.mjs";

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
    remarkPlugins: [remarkDesc],
  },
  integrations: [tailwind(), markdownIntegration(), preact()]
});