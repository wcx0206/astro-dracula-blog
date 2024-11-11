// @ts-check
import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeMathjax from 'rehype-mathjax';
import rehypeExternalLinks from 'rehype-external-links';
import { rehypeGithubAlerts } from 'rehype-github-alerts';

import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from '@astrojs/tailwind';
import partytown from "@astrojs/partytown";

import { SITE } from './src/config.ts';
import { remarkDescPlugin } from "./src/utils/markdown.ts";

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
  integrations: [react(), sitemap(), tailwind(), partytown()],
  output: "static"
});