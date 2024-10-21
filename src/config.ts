export const SITE = {
    title: "BlockLune's Blog",
    description: "A blog about development and life, powered by Astro.",
};

export const AUTHOR = {
    name: "BlockLune",
    link: "https://github.com/BlockLune",
    email: "i@blocklune.cc",
}

export const SOCIALS = [
    {
        name: "Github",
        href: "https://github.com/BlockLune",
        linkTitle: `${AUTHOR.name} on Github`,
    },
    {
        name: "Mail",
        href: `mailto:${AUTHOR.email}`,
        linkTitle: `Send an email to ${AUTHOR.name}`,
    },
];

export const MISC = {
    more: {
        marks: ["<!--more-->", "<!-- more -->"],
        limitWhenNoMark: 30,
    },
    dateTag: {
        daysToBeGreen: 7,
    }
}