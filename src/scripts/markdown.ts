import { toString } from "mdast-util-to-string";

export function getDescFromString(content: string) {
    const pos = content.indexOf("<!--more-->");
    return content.slice(0, pos);
}

export function remarkDescPlugin() {
    return function (tree: any, { data }: any) {
        let textOnPage = toString(tree);
        data.astro.frontmatter.desc = getDescFromString(textOnPage);
    };
}