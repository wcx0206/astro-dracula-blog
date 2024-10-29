import { useState } from "react";
import { useDebounce } from 'use-debounce';
import Fuse from "fuse.js";
import PostCard from "./post-card";
import type { PostSearchItem } from "../schemas";
import { ui } from "../i18n/ui";

const fuseOptions = {
    keys: ["slug", "title", "description", "tags"]
}

export default function PostStack({
  lang,
  sortedPostSearchItems,
}: {
  lang: keyof typeof ui;
  sortedPostSearchItems: PostSearchItem[];
}) {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 300);

    let results: PostSearchItem[] = [];
    if (debouncedQuery === "") {
        results = sortedPostSearchItems;
    } else {
        const fuse = new Fuse(sortedPostSearchItems, fuseOptions);
        results = fuse.search(debouncedQuery).map((result) => result.item).slice(0, 5);
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
            {results.length > 0 ? results.map((postSearchItem) =>
                <PostCard postSearchItem={postSearchItem} animate={true} key={postSearchItem.slugWithoutLang} />
            ) : <p>No results found</p>}
        </div>
    );
}
