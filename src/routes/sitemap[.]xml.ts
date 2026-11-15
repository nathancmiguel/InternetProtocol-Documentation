import { createFileRoute } from "@tanstack/react-router";
import { absoluteUrl } from "@/lib/shared";
import { source } from "@/lib/source";

function escapeXml(value: string) {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

export const Route = createFileRoute("/sitemap.xml")({
	server: {
		handlers: {
			GET: async () => {
				const entries = [
					{ url: absoluteUrl("/"), priority: "1.0" },
					...source.getPages().map((page) => ({
						url: absoluteUrl(page.url),
						priority: page.slugs.length === 0 ? "0.9" : "0.7",
					})),
				];

				const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
	.map(
		(entry) =>
			`  <url><loc>${escapeXml(entry.url)}</loc><priority>${entry.priority}</priority></url>`,
	)
	.join("\n")}
</urlset>
`;

				return new Response(body, {
					headers: {
						"Content-Type": "application/xml; charset=utf-8",
						"Cache-Control": "public, max-age=3600",
					},
				});
			},
		},
	},
});
