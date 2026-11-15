import { createFileRoute } from "@tanstack/react-router";
import { absoluteUrl } from "@/lib/shared";

export const Route = createFileRoute("/robots.txt")({
	server: {
		handlers: {
			GET: async () =>
				new Response(
					`User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${absoluteUrl("/sitemap.xml")}
`,
					{
						headers: {
							"Content-Type": "text/plain; charset=utf-8",
							"Cache-Control": "public, max-age=86400",
						},
					},
				),
		},
	},
});
