import { useState } from "react";
import { useDebounce } from 'use-debounce';
import Fuse from "fuse.js";
import LabelTag from "./label-tag";
import { ui } from "@i18n/ui";

export default function TagGroup({ lang, tagMap }: { lang: keyof typeof ui, tagMap: Map<string, number> }) {
    const [query, setQuery] = useState("");
    const [debouncedQuery] = useDebounce(query, 300);

    let results: string[] = [];
    if (debouncedQuery !== "") {
        const fuse = new Fuse(Array.from(tagMap.keys()));
        results = fuse.search(debouncedQuery).map((result) => result.item);
    }

    function handleOnSearch(event: React.ChangeEvent<HTMLInputElement>) {
        setQuery(event.target.value);
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col">
                <label className="sr-only" htmlFor="search">Search</label>
                <input
                    id="search"
                    type="text"
                    placeholder="Search..."
                    className="bg-dracula-dark/20 placeholder-dracula-blue 
                    text-dracula-light focus:outline-none focus:bg-dracula-dark 
                    hover:bg-dracula-dark px-8 py-4 transition"
                    value={query}
                    onChange={handleOnSearch}
                />
            </div>
            <div className="flex flex-wrap gap-2">
                {
                    debouncedQuery === "" ?
                        Array.from(tagMap.entries())
                            .sort((a, b) => b[1] - a[1])
                            .map(([tag, count]) => (
                                <LabelTag lang={lang} label={tag} count={count} type="link" key={tag} animate={true} />
                            ))
                        :
                        results.map((tag) => (
                            <LabelTag lang={lang} label={tag} count={tagMap.get(tag)} type="link" key={tag} animate={true} />
                        ))
                }
            </div>
        </div>
    );
}