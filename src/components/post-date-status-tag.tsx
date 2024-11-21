import { getColor } from "@/utils/date";
import { type Lang, useTranslations } from "@/utils/i18n";

export default function PostDateStatusTag({ lang, diffInDays }: { lang: Lang; diffInDays: number }) {
  const t = useTranslations(lang);
  const color = getColor(diffInDays);
  const textColor = `text-dracula-${color}`;

  if (color === "orange") return null;
  return (
    <code className={`inline-block bg-dracula-dark/30 px-2 py-1 ${textColor}`}>
      {color === "green" ? t("post.newlyUpdatedMsg") : color === "red" ? t("post.oldPostWarningMsg") : undefined}
    </code>
  );
}
