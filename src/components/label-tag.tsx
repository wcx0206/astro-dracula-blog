export default function LabelTag(
    { label, count = 1, type = "tag" }:
        {
            label: string,
            count?: number,
            type?: "tag" | "link"
        }
) {
    const text = count > 1 ? `${label} (${count})` : label;
    const href = type === "link" ? `/tags/${label}` : undefined;
    return (
        <a href={href}
            class="inline-block px-2 py-1 font-code
                text-dracula-purple bg-dracula-dark/80 
                hover:bg-dracula-dark transition">
            {text}
        </a>
    );
}