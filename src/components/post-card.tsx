import DateTag from "./date-tag";
import LabelTag from "./label-tag";
import type { Post } from "../schemas";
import { getDescFromString } from "../scripts/markdown";
import { getUniqueLowerCaseTagMap, getCloserFormattedDate } from "../scripts/utils";

export default function PostCard({ post }: { post: Post }) {
    const href = `/posts/${post.slug}`;
    const title = post.data.title;
    const date = getCloserFormattedDate(post.data.date.toISOString(), post.data.updated?.toISOString())!;
    const tags = Array.from(getUniqueLowerCaseTagMap(post.data.tags).keys());
    const desc = getDescFromString(post.body);

    return (
        <a
            href={href}
            class="p-8 bg-dracula-dark/20 hover:bg-dracula-dark transition cursor-pointer text-pretty flex flex-col gap-4"
        >
            <h2 class="font-bold text-3xl text-dracula-pink">{title}</h2>
            <div class="flex flex-wrap gap-2">
                <DateTag date={date} />
                {tags.map((tag) => <LabelTag label={tag} />)}
            </div>
            <p class="overflow-ellipsis break-all line-clamp-3">{desc}</p>
        </a>
    );
}