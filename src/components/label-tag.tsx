import { motion } from "motion/react";
import type { Lang } from "@/utils/i18n";

export default function LabelTag(
    { lang, label, count = 1, type = "tag", size = "normal", animate = false }:
        {
            lang: Lang,
            label: string,
            count?: number,
            type?: "tag" | "link",
            size?: "normal" | "large",
            animate?: boolean
        }
) {
    const text = count > 1 ? `${label} (${count})` : label;
    const className = size === "large" ? "text-4xl px-4 py-2" : "px-2 py-1";
    const tagComponent = (<code
        className={`inline-block ${className}
                text-dracula-purple bg-dracula-dark/30
                hover:bg-dracula-dark transition`}>
        {text}
    </code>);
    let linkTagOrNot = type === "link" ? <a href={`/${lang}/tags/${label}`}>{tagComponent}</a> : tagComponent;
    let animatedLinkTagOrNot = animate ?
        <motion.div initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }}>{linkTagOrNot}</motion.div>
        : linkTagOrNot;
    return animatedLinkTagOrNot;
}