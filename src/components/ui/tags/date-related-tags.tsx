import DateTag from "@/components/ui/tags/date-tag";
import PostDateStatusTag from "@/components/ui/tags/post-date-status-tag";
import type { Lang } from "@/utils/i18n";
import { getDiffInDays } from "@/utils/date";

export default function DateRelatedTags({
  lang,
  publishedAt,
  updatedAt,
}: {
  lang: Lang;
  publishedAt: string;
  updatedAt?: string;
}) {
  const latestDate = updatedAt || publishedAt;
  const diffInDays = getDiffInDays(new Date(), latestDate);

  return (
    <>
      <DateTag lang={lang} date={publishedAt} type="published" />
      {updatedAt && <DateTag lang={lang} date={updatedAt} type="updated" />}
      <PostDateStatusTag lang={lang} diffInDays={diffInDays} />
    </>
  );
}
