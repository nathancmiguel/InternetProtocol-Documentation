import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { appName, links } from "./shared";

export function baseOptions(): BaseLayoutProps {
	return {
		nav: {
			title: (
				<span className="inline-flex items-center gap-2 font-semibold tracking-tight">
					<img
						src="/logo.png"
						alt=""
						width={22}
						height={22}
						className="size-5.5"
					/>
					{appName}
				</span>
			),
			url: "/",
		},
		githubUrl: links.library,
		links: [
			{
				text: "Documentation",
				url: "/docs",
				active: "nested-url",
			},
		],
	};
}
