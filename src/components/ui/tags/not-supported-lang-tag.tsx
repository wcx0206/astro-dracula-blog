import { type Lang, useTranslations } from "@/utils/i18n";

export default function LicenseTag({ lang }: { lang: Lang }) {
  const t = useTranslations(lang);
  return (
    <code className="inline-block bg-dracula-dark/30 px-2 py-1" title={t("post.notSupportedLangDescription")}>
      <span className="text-dracula-red-400">{t("post.notSupportedLang")}</span>
    </code>
  );
}
