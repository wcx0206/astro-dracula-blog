import { MISC } from "@/config";

export const languages = {
  en: "EN",
  zh: "中",
};

export const defaultLang: Lang = "en";

export const ui = {
  en: {
    "nav.home": "Home",
    "nav.tags": "Tags",
    "nav.about": "About",
    "search.placeholder.firstPart": "Search in ",
    "search.placeholder.secondPart.post": " posts...",
    "search.placeholder.secondPart.tag": " tags...",
    "search.noResults": "No results found",
    postsWithTag: "Posts with tag",
    toc: "Table of Content",
    pageNotFound: "PAGE NOT FOUND",
    goBackHome: "Go Back Home",
    publishedAt: "Published at",
    updatedAt: "Updated at",
    "post.newlyUpdatedMsg": `Updated in ${MISC.dateTag.daysToBeGreen} days`,
    "post.oldPostWarningMsg": `Last update over ${MISC.dateTag.daysToBeRed} days ago`,
    "post.license": "Licensed under",
  },
  zh: {
    "nav.home": "首页",
    "nav.tags": "标签",
    "nav.about": "关于",
    "search.placeholder.firstPart": "在 ",
    "search.placeholder.secondPart.post": " 篇文章中搜索...",
    "search.placeholder.secondPart.tag": " 个标签中搜索...",
    "search.noResults": "没有找到结果",
    postsWithTag: "带有以下标签的文章",
    toc: "目录",
    pageNotFound: "未找到此页面",
    goBackHome: "返回首页",
    publishedAt: "发表于",
    updatedAt: "更新于",
    "post.newlyUpdatedMsg": `更新于 ${MISC.dateTag.daysToBeGreen} 日内`,
    "post.oldPostWarningMsg": `更新于 ${MISC.dateTag.daysToBeRed} 日前`,
    "post.license": "许可证",
  },
} as const;

export type Lang = keyof typeof ui;

export function useTranslatedPath(lang: keyof typeof ui) {
  return function translatePath(path: string, l: string = lang) {
    return `/${l}${path}`;
  };
}

export function getLangFromUrl(url: string) {
  const [, lang, ...rest] = url.split("/");
  const urlWithoutLang = rest.join("/");
  if (lang in ui) return [lang as keyof typeof ui, urlWithoutLang];
  return [defaultLang as keyof typeof ui, urlWithoutLang];
}

export function useTranslations(lang: Lang) {
  return function t(key: keyof (typeof ui)[typeof lang]) {
    return ui[lang][key] || ui[defaultLang][key];
  };
}
