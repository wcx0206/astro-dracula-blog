export const SITE = {
    title: "BlockLune's Blog",
    description: "A blog about development and life, powered by Astro.",
    url: "https://blocklune.cc",
};

export const AUTHOR = {
    name: "BlockLune",
    link: "https://github.com/BlockLune",
    email: "i@blocklune.cc",
    bio: "A student majoring in computer science and technology."
}

export const SOCIALS = [
    {
        name: "Github",
        href: "https://github.com/BlockLune",
        linkTitle: `${AUTHOR.name} on Github`,
    },
    {
        name: "Email",
        href: `mailto:${AUTHOR.email}`,
        linkTitle: `Send an email to ${AUTHOR.name}`,
    },
];

export const MISC = {
    more: {
        marks: ["<!--more-->", "<!-- more -->"],
    },
    dateTag: {
        daysToBeGreen: 7,
    }
}