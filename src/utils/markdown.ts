import { fromMarkdown } from "mdast-util-from-markdown";
import { toString } from "mdast-util-to-string";

export function getDescFromMdString(mdString: string) {
    const mdast = fromMarkdown(mdString);
    const desc = toString(mdast);
    const pos = desc.indexOf("<!--more-->");
    return desc.slice(0, pos);
}

export function remarkDescPlugin() {
    return function (tree: any, { data }: any) {
        let textOnPage = toString(tree);
        data.astro.frontmatter.desc = getDescFromMdString(textOnPage);
    };
}