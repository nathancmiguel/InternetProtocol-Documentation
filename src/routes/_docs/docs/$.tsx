import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useFumadocsLoader } from "fumadocs-core/source/client";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import {
	DocsBody,
	DocsDescription,
	DocsPage,
	DocsTitle,
	EditOnGitHub,
} from "fumadocs-ui/layouts/docs/page";
import { Suspense, use } from "react";
import { useMDXComponents } from "@/components/mdx";
import { baseOptions } from "@/lib/layout.shared";
import { docsSection, jsonLd, seo } from "@/lib/seo";
import {
	absoluteUrl,
	appDescription,
	appName,
	gitConfig,
	ogImage,
} from "@/lib/shared";
import { docs, source } from "@/lib/source";

export const Route = createFileRoute("/_docs/docs/$")({
	component: Page,
	loader: async ({ params }) => {
		const data = await serverLoader({
			data: {
				slugs: params._splat?.split("/").filter(Boolean) ?? [],
			},
		});
		await docs.getPage(data.path)?.preload();
		return data;
	},
	head: ({ loaderData }) => {
		if (!loaderData) return {};
		const section = docsSection(loaderData.path);
		// Header and Unreal pages share names ("TCP Client"), so the section keeps titles unique.
		const title = [loaderData.title, section, appName]
			.filter(Boolean)
			.join(" | ");
		const { meta, links } = seo({
			title,
			description: loaderData.description ?? appDescription,
			path: loaderData.url,
			type: "article",
			keywords: [loaderData.title, ...(section ? [section] : [])],
		});

		const crumbs = [
			{ name: appName, url: absoluteUrl("/") },
			{ name: "Docs", url: absoluteUrl("/docs") },
			...(section ? [{ name: section, url: null }] : []),
			{ name: loaderData.title, url: absoluteUrl(loaderData.url) },
		];

		return {
			meta,
			links,
			scripts: [
				jsonLd({
					"@context": "https://schema.org",
					"@type": "BreadcrumbList",
					itemListElement: crumbs.map((crumb, index) => ({
						"@type": "ListItem",
						position: index + 1,
						name: crumb.name,
						...(crumb.url ? { item: crumb.url } : {}),
					})),
				}),
				jsonLd({
					"@context": "https://schema.org",
					"@type": "TechArticle",
					headline: loaderData.title,
					description: loaderData.description ?? appDescription,
					url: absoluteUrl(loaderData.url),
					image: absoluteUrl(ogImage.path),
					isPartOf: {
						"@type": "WebSite",
						name: appName,
						url: absoluteUrl("/"),
					},
				}),
			],
		};
	},
});

const serverLoader = createServerFn({
	method: "GET",
})
	.validator((params: { slugs: string[] }) => params)
	.handler(async ({ data: { slugs } }) => {
		const page = source.getPage(slugs);
		if (!page) throw notFound();

		return {
			path: page.path,
			url: page.url,
			title: page.data.title ?? appName,
			description: page.data.description,
			pageTree: await source.serializePageTree(source.getPageTree()),
		};
	});

function Content({ path }: { path: string }) {
	const page = docs.getPage(path);
	if (!page) throw new Error(`unknown page: ${path}`);

	const { toc } = use(page.load());
	const MDX = page.body;

	return (
		<DocsPage toc={toc} tableOfContent={{ style: "clerk" }}>
			<DocsTitle>{page.title}</DocsTitle>
			<DocsDescription>{page.description}</DocsDescription>
			<DocsBody>
				<MDX components={useMDXComponents()} />
			</DocsBody>
			<EditOnGitHub
				href={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/content/docs/${path}`}
			/>
		</DocsPage>
	);
}

function Page() {
	const data = useFumadocsLoader(Route.useLoaderData());

	return (
		<DocsLayout {...baseOptions()} tree={data.pageTree}>
			<Suspense>
				<Content path={data.path} />
			</Suspense>
		</DocsLayout>
	);
}
