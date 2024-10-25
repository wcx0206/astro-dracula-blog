import { motion } from "framer-motion";
import DateTag from "./date-tag";
import LabelTag from "./label-tag";
import type { PostSearchItem } from "../schemas";

export default function PostCard({ postSearchItem, animate = false }: { postSearchItem: PostSearchItem, animate?: boolean }) {
    let component =
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
        </a>;
    return animate ? <motion.div initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }}>{component}</motion.div> : component;
}