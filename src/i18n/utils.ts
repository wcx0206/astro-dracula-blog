import { ui, defaultLang } from './ui';

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
