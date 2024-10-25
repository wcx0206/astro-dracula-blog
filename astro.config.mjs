// @ts-check
import { defineConfig } from 'astro/config';
import { SITE } from './src/config.ts';

import tailwind from '@astrojs/tailwind';
import markdownIntegration from '@astropub/md'
import react from "@astrojs/react";

import { remarkDescPlugin } from "./src/scripts/markdown.ts";
import remarkMath from 'remark-math';
import rehypeMathjax from 'rehype-mathjax';
import rehypeExternalLinks from 'rehype-external-links';
import { rehypeGithubAlerts } from 'rehype-github-alerts';

// https://astro.build/config
export default defineConfig({
  site: SITE.url,
  markdown: {
    shikiConfig: {
      theme: "dracula",
      wrap: true,
      langAlias: {
        "C": "c",
        "zshrc": "zsh",
      }
    },
    remarkPlugins: [remarkDescPlugin, remarkMath],
    rehypePlugins: [rehypeMathjax, rehypeExternalLinks, rehypeGithubAlerts],

  },
  integrations: [tailwind(), markdownIntegration(), react()]
});