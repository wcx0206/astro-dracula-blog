// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';
import markdownIntegration from '@astropub/md'
import react from "@astrojs/react";

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
  integrations: [tailwind(), markdownIntegration(), react()]
});