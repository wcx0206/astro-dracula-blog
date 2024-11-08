export const languages = {
    en: "English",
    zh: "简体中文",
};

export const defaultLang : Lang = "en";

export const ui = {
    en: {
        "nav.home": "Home",
        "nav.tags": "Tags",
        "nav.about": "About",
        "search.placeholder": "Search...",
        "search.noResults": "No results found",
        "postsWithTag": "Posts with tag",
        "toc": "Table of Content",
    },
    zh: {
        "nav.home": "首页",
        "nav.tags": "标签",
        "nav.about": "关于",
        "search.placeholder": "搜索...",
        "search.noResults": "没有找到结果",
        "postsWithTag": "带有以下标签的文章",
        "toc": "目录",
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
