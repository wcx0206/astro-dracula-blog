import { motion } from "framer-motion";
import DateTag from "./date-tag";
import LabelTag from "./label-tag";
import type { PostSnapshot } from "@/schemas/post";
import type { Lang } from "@/utils/i18n"


export default function PostCard({ lang, snapshot, animate = false }: { lang: Lang, snapshot: PostSnapshot, animate?: boolean }) {
    let component =
        <a
            href={snapshot.href}
            className="p-8 bg-dracula-dark/20 hover:bg-dracula-dark transition cursor-pointer text-pretty flex flex-col gap-4"
        >
            <h2 className="font-bold text-3xl text-dracula-pink">{snapshot.title}</h2>
            <div className="flex flex-wrap gap-2">
                <DateTag date={snapshot.date} />
                {snapshot.tags.map((tag, index) => <LabelTag lang={lang} label={tag} key={index} />)}
            </div>
            <p className="overflow-ellipsis break-all line-clamp-3">{snapshot.description}</p>
        </a>;
    return animate ? <motion.div initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }}>{component}</motion.div> : component;
}