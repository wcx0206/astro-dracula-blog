import { MISC } from "@/config";
import { getColor, getDiffInDays, getFormattedDate } from "@/utils/date";
import { type Lang, useTranslations } from "@/utils/i18n";

export default function DateTag({
  lang,
  date,
  type,
}: {
  lang: Lang;
  date: string;
  type?: "published" | "updated";
}) {
  const t = useTranslations(lang);
  const formattedDate = getFormattedDate(date);
  const diffInDays = getDiffInDays(new Date(), date);
  const color = getColor(diffInDays);
  const textColor = `text-dracula-${color}`;

  const greenTitleText = t("newlyUpdatedMsg.firstPart") + MISC.dateTag.daysToBeGreen + t("newlyUpdatedMsg.secondPart");
  const redTitleText = t("oldPostMsg.firstPart") + MISC.dateTag.daysToBeRed + t("oldPostMsg.secondPart");

  const titleText = color === "green" ? greenTitleText : color === "red" ? redTitleText : undefined;

  /**
   * If type is given, it will display the type and the date.
   * The published type label is green, updated is orange.
   *
   * Otherwise, it will only display the date.
   * Depending on the configuration, the text will be in different colors.
   */
  return (
    <div className="flex items-center">
      {type ? (
        <code className="inline-block bg-dracula-dark/30 px-2 py-1">
          <span className={type === "published" ? "text-dracula-orange" : "text-dracula-green"}>{t(`${type}At`)}</span>{" "}
          <span>{formattedDate}</span>
        </code>
      ) : (
        <code title={titleText} className={`inline-block bg-dracula-dark/30 px-2 py-1 ${textColor}`}>
          {formattedDate}
        </code>
      )}
    </div>
  );
}
