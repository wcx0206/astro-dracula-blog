import { ui, defaultLang, showDefaultLang } from './ui';

export function useTranslatedPath(lang: keyof typeof ui) {
    return function translatePath(path: string, l: string = lang) {
        return !showDefaultLang && l === defaultLang ? path : `/${l}${path}`
    }
}

export function getLangFromUrl(url: string) {
    const [, lang] = url.split("/");
    if (lang in ui) return lang as keyof typeof ui;
    return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
    return function t(key: keyof typeof ui[typeof lang]) {
        return ui[lang][key] || ui[defaultLang][key];
    }
}
