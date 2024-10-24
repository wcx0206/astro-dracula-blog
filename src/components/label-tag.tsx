export default function LabelTag(
    { label, count = 1, type = "tag" }:
        {
            label: string,
            count?: number,
            type?: "tag" | "link"
        }
) {
    const text = count > 1 ? `${label} (${count})` : label;
    const tagComponent = (<code
        class="inline-block px-2 py-1
                text-dracula-purple bg-dracula-dark/80 
                hover:bg-dracula-dark transition">
        {text}
    </code>);
    return type === "link" ? <a href={`/tags/${label}`}>{tagComponent}</a> : tagComponent;
}