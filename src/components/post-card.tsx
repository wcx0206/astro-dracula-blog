import DateTag from "./date-tag";
import LabelTag from "./label-tag";
import type { PostSearchItem } from "../schemas";

export default function PostCard({ postSearchItem }: { postSearchItem: PostSearchItem }) {
    return (
        <a
            href={postSearchItem.href}
            className="p-8 bg-dracula-dark/20 hover:bg-dracula-dark transition cursor-pointer text-pretty flex flex-col gap-4"
        >
            <h2 className="font-bold text-3xl text-dracula-pink">{postSearchItem.title}</h2>
            <div className="flex flex-wrap gap-2">
                <DateTag date={postSearchItem.date} />
                {postSearchItem.tags.map((tag, index) => <LabelTag label={tag} key={index} />)}
            </div>
            <p className="overflow-ellipsis break-all line-clamp-3">{postSearchItem.description}</p>
        </a>
    );
}