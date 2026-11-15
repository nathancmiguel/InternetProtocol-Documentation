import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { UEvents, UFunction, UVar } from "@/components/unreal";

export function getMDXComponents(components?: MDXComponents) {
	return {
		...defaultMdxComponents,
		UVar,
		UEvents,
		UFunction,
		...components,
	} satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
	type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
