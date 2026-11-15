import { absoluteUrl, appKeywords, appName, ogImage } from "./shared";

interface SeoOptions {
	/** Full document title. */
	title: string;
	description: string;
	/** Path of the page, used for the canonical URL and og:url. */
	path: string;
	type?: "website" | "article";
	keywords?: string[];
}

/** Meta and link tags for a page: description, canonical, Open Graph and Twitter. */
export function seo({
	title,
	description,
	path,
	type = "website",
	keywords = [],
}: SeoOptions) {
	const url = absoluteUrl(path);
	const image = absoluteUrl(ogImage.path);

	return {
		meta: [
			{ title },
			{ name: "description", content: description },
			{ name: "keywords", content: [...keywords, ...appKeywords].join(", ") },
			{ property: "og:type", content: type },
			{ property: "og:site_name", content: appName },
			{ property: "og:title", content: title },
			{ property: "og:description", content: description },
			{ property: "og:url", content: url },
			{ property: "og:image", content: image },
			{ property: "og:image:width", content: String(ogImage.width) },
			{ property: "og:image:height", content: String(ogImage.height) },
			{ property: "og:image:alt", content: `${appName} logo` },
			{ name: "twitter:card", content: "summary_large_image" },
			{ name: "twitter:title", content: title },
			{ name: "twitter:description", content: description },
			{ name: "twitter:image", content: image },
		],
		links: [{ rel: "canonical", href: url }],
	};
}

/** A JSON-LD <script> entry for TanStack Router's `head().scripts`. */
export function jsonLd(data: Record<string, unknown>) {
	return {
		type: "application/ld+json",
		children: JSON.stringify(data),
	};
}

/** Human label of the docs section a page belongs to, used to disambiguate titles. */
export function docsSection(path: string) {
	if (path.startsWith("Header/")) return "C++ Library";
	if (path.startsWith("Unreal/")) return "Unreal Engine";
	return null;
}
