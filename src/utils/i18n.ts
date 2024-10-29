export const languages = {
    en: "English",
    zh: "简体中文",
};

export const defaultLang = "en";

export const ui = {
    en: {
        "nav.home": "Home",
        "nav.tags": "Tags",
        "nav.about": "About",
    },
    zh: {
        "nav.home": "首页",
        "nav.tags": "标签",
        "nav.about": "关于",
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

export function useTranslations(lang: keyof typeof ui) {
    return function t(key: keyof typeof ui[typeof lang]) {
        return ui[lang][key] || ui[defaultLang][key];
    }
}
