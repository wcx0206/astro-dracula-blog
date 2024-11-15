export const languages = {
    en: "EN",
    zh: "中",
};

export const defaultLang : Lang = "en";

export const ui = {
    en: {
        "nav.home": "Home",
        "nav.tags": "Tags",
        "nav.about": "About",
        "search.placeholder.first_part": "Search in ",
        "search.placeholder.second_part.post": " posts...",
        "search.placeholder.second_part.tag": " tags...",
        "search.noResults": "No results found",
        "postsWithTag": "Posts with tag",
        "toc": "Table of Content",
        "pageNotFound": "PAGE NOT FOUND",
        "goBackHome": "Go Back Home",
    },
    zh: {
        "nav.home": "首页",
        "nav.tags": "标签",
        "nav.about": "关于",
        "search.placeholder.first_part": "在 ",
        "search.placeholder.second_part.post": " 篇文章中搜索...",
        "search.placeholder.second_part.tag": " 个标签中搜索...",
        "search.noResults": "没有找到结果",
        "postsWithTag": "带有以下标签的文章",
        "toc": "目录",
        "pageNotFound": "未找到此页面",
        "goBackHome": "返回首页",
    },
} as const;

export type Lang = keyof typeof ui;

export function useTranslatedPath(lang: keyof typeof ui) {
    return function translatePath(path: string, l: string = lang) {
        return `/${l}${path}`
    }
}


export function getLangFromUrl(url: string) {
    const [, lang, ...rest] = url.split("/");
    const urlWithoutLang = rest.join("/");
    if (lang in ui) return [lang as keyof typeof ui, urlWithoutLang];
    return [defaultLang as keyof typeof ui, urlWithoutLang];
}

export function useTranslations(lang: Lang) {
    return function t(key: keyof typeof ui[typeof lang]) {
        return ui[lang][key] || ui[defaultLang][key];
    }
}
