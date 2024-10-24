import { useState } from "react";
import Fuse from "fuse.js";
import PostCard from "./post-card";
import type { Post } from "../schemas";
const fuseOptions = {
    keys: ["data.title", "data.description", "data.tags", "slug"],
}

export default function PostStack({ posts }: { posts: Post[] }) {
    const [query, setQuery] = useState("");

    let results: Post[] = [];
    if (query === "") {
        results = posts
            .sort((a, b) => {
                const dateA = a.data.updated || a.data.date;
                const dateB = b.data.updated || b.data.date;
                return dateB.getTime() - dateA.getTime();
            })
    } else {
        const fuse = new Fuse(posts, fuseOptions);
        results = fuse.search(query).map((result) => result.item).slice(0, 5);
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
            {results.length > 0 ? results.map((post) => <PostCard post={post} />) : <p>No results found</p>}
        </div>
    );
}
