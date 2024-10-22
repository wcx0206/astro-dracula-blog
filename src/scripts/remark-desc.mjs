import { toString } from 'mdast-util-to-string';

export function remarkDesc() {
    return function (tree, { data }) {
        let textOnPage = toString(tree);
        textOnPage = textOnPage.trim();
        const pos = textOnPage.indexOf("<!--more-->");
        data.astro.frontmatter.desc = textOnPage.slice(0, pos);
  };
}
