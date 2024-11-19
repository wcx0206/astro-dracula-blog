/**
 * Create a new post in the content/posts directory
 */

import fs from "node:fs";
import path from "node:path";
import slugify from "slugify";

function getDate() {
	const date = new Date();
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-based
	const day = String(date.getDate()).padStart(2, "0");
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");
	const seconds = String(date.getSeconds()).padStart(2, "0");

	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const ERROR_NO_FILENAME = "Error: No filename argument provided";
const ERROR_FILE_EXISTS = "Error: File already exists";
const USAGE_STRING = "Usage: npm run new-post -- <filename>";
const TARGET_DIR = "./src/content/posts/en/";
const FILE_EXTENSION_REGEX = /\.(md|mdx)$/i;
const DEFAULT_FILE_EXTENSION = ".md";

const args = process.argv.slice(2);
if (args.length === 0) {
	console.error(`${ERROR_NO_FILENAME}\n${USAGE_STRING}`);
	process.exit(1);
}

let fileName = slugify(args[0]); // Convert to slug
if (!FILE_EXTENSION_REGEX.test(fileName)) {
	fileName += DEFAULT_FILE_EXTENSION;
}

const fullPath = path.join(TARGET_DIR, fileName);
if (fs.existsSync(fullPath)) {
	console.error(`${ERROR_FILE_EXISTS}: ${fullPath}`);
	process.exit(1);
}

const content = `---
title: ${args[0]}
date: ${getDate()}
---
`;

fs.writeFileSync(fullPath, content);
console.log(`Post ${fullPath} created`);
