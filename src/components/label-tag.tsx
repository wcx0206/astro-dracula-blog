export default function LabelTag(
    { label, count = 1, type = "tag", size = "normal" }:
        {
            label: string,
            count?: number,
            type?: "tag" | "link",
            size?: "normal" | "large"
        }
) {
    const text = count > 1 ? `${label} (${count})` : label;
    const className = size === "large" ? "text-4xl px-4 py-2" : "px-2 py-1";
    const tagComponent = (<code
        className={`inline-block ${className}
                text-dracula-purple bg-dracula-dark/80 
                hover:bg-dracula-dark transition`}>
        {text}
    </code>);
    return type === "link" ? <a href={`/tags/${label}`}>{tagComponent}</a> : tagComponent;
}