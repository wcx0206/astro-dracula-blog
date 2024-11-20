import { MISC } from "@/config";
import { useTranslations, type Lang } from "@/utils/i18n";

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

  const now = new Date();
  const target = new Date(date);
  const diffInMilliseconds: number = now.getTime() - target.getTime();
  const diffInDays = Math.round(diffInMilliseconds / (1000 * 60 * 60 * 24));

  const color =
    diffInDays <= MISC.dateTag.daysToBeGreen
      ? "text-dracula-green"
      : diffInDays > MISC.dateTag.daysToBeRed
      ? "text-dracula-red"
      : "text-dracula-orange";

  const formattedDate = new Date(date).toISOString().slice(0, 10);

  const greenTitleText =
    t("newlyUpdatedMsg.firstPart") +
    MISC.dateTag.daysToBeGreen +
    t("newlyUpdatedMsg.secondPart");

  const redTitleText =
    t("oldPostMsg.firstPart") +
    MISC.dateTag.daysToBeRed +
    t("oldPostMsg.secondPart");

  const titleText =
    color === "text-dracula-green"
      ? greenTitleText
      : color === "text-dracula-red"
      ? redTitleText
      : undefined;

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
          <span
            className={
              type === "published"
                ? "text-dracula-orange"
                : "text-dracula-green"
            }
          >
            {t(`${type}At`)}
          </span>{" "}
          <span>{formattedDate}</span>
        </code>
      ) : (
        <code
          title={titleText}
          className={`inline-block bg-dracula-dark/30 px-2 py-1 ${color}`}
        >
          {formattedDate}
        </code>
      )}
    </div>
  );
}
