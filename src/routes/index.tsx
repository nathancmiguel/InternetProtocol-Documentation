import { createFileRoute, Link } from "@tanstack/react-router";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import {
	ArrowRight,
	ArrowRightLeft,
	BookOpen,
	Braces,
	Cable,
	CodeXml,
	Cpu,
	Gamepad2,
	Globe,
	Heart,
	type LucideIcon,
	Play,
	Radio,
	ShieldCheck,
	Video,
	Workflow,
} from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	BlueprintCanvas,
	BlueprintNode,
	FunctionIcon,
	getPinMeta,
	PinRow,
	type Wire,
} from "@/components/unreal";
import { baseOptions } from "@/lib/layout.shared";
import { jsonLd, seo } from "@/lib/seo";
import {
	absoluteUrl,
	appDescription,
	appName,
	appTagline,
	links,
} from "@/lib/shared";

export const Route = createFileRoute("/")({
	component: Home,
	head: () => {
		const { meta, links: headLinks } = seo({
			title: `${appName} — ${appTagline}`,
			description: appDescription,
			path: "/",
		});
		return {
			meta,
			links: headLinks,
			scripts: [
				jsonLd({
					"@context": "https://schema.org",
					"@type": "WebSite",
					name: appName,
					url: absoluteUrl("/"),
					description: appDescription,
				}),
				jsonLd({
					"@context": "https://schema.org",
					"@type": "SoftwareSourceCode",
					name: appName,
					description: appDescription,
					codeRepository: links.library,
					programmingLanguage: "C++",
					runtimePlatform: ["C++17", "Unreal Engine"],
					license: "https://mit-license.org/",
					author: {
						"@type": "Person",
						name: "Nathan Miguel",
						url: links.author,
					},
				}),
			],
		};
	},
});

const cppSample = `#include "ip.hpp"

using namespace internetprotocol;

int main() {
    tcp_client_c net;

    net.on_message_received = [&](const std::vector<uint8_t> &buffer, size_t bytes) {
        std::cout << buffer_to_string(buffer) << std::endl;
    };
    net.connect();

    net.write("Hello, server!", [](const asio::error_code &ec, size_t bytes_sent) {
        // message sent
    });

    join_threads();
}`;

interface Protocol {
	name: string;
	icon: LucideIcon;
	description: string;
	slug: string;
	ssl: boolean;
	/** Docs pages to link to; defaults to the C++ and Unreal server pages. */
	links?: { label: string; splat: string }[];
}

const protocols: Protocol[] = [
	{
		name: "UDP",
		icon: Radio,
		description:
			"Connectionless datagrams for low-latency messaging, discovery and real-time state.",
		slug: "udp",
		ssl: false,
	},
	{
		name: "TCP",
		icon: Cable,
		description:
			"Reliable, ordered streams with configurable buffers and automatic packet splitting.",
		slug: "tcp",
		ssl: true,
	},
	{
		name: "HTTP",
		icon: Globe,
		description:
			"Serve and consume REST endpoints with routing, headers, payloads and keep-alive.",
		slug: "http",
		ssl: true,
	},
	{
		name: "WebSocket",
		icon: ArrowRightLeft,
		description:
			"Full-duplex text and binary frames over a single connection, with ping/pong control.",
		slug: "websocket",
		ssl: true,
	},
	{
		name: "RTMP",
		icon: Video,
		description:
			"Live audio and video in Unreal 5.8 (DirectX 12): receive OBS streams, serve viewers and publish to Twitch or YouTube.",
		slug: "rtmp",
		ssl: true,
		links: [{ label: "Unreal", splat: "Unreal/rtmp" }],
	},
];

const features: { icon: LucideIcon; title: string; description: string }[] = [
	{
		icon: Cpu,
		title: "Header-only C++17",
		description:
			"Drop the headers in your include folder. No Boost, just standalone Asio.",
	},
	{
		icon: Workflow,
		title: "Full control",
		description:
			"Manage every connection, buffer and callback yourself — nothing is hidden.",
	},
	{
		icon: ShieldCheck,
		title: "Optional OpenSSL",
		description:
			"TLS variants for TCP, HTTP and WebSocket, both server and client side.",
	},
	{
		icon: Braces,
		title: "Blueprint & JSON",
		description:
			"Every module exposed to Blueprints in Unreal, plus a JSON object API.",
	},
];

function Home() {
	return (
		<HomeLayout {...baseOptions()} className="relative overflow-x-clip">
			<Backdrop />
			<Hero />
			<Section
				eyebrow="Modules"
				title="Every protocol you need, client and server"
				description="Each module ships as a header-only C++ class and as a Blueprint-ready Unreal Engine object."
			>
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
					{protocols.map((protocol) => (
						<ProtocolCard key={protocol.name} protocol={protocol} />
					))}
				</div>
			</Section>
			<Section
				eyebrow="Why Internet Protocol"
				title="Simple to start, nothing in your way"
			>
				<div className="grid gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-2 lg:grid-cols-4">
					{features.map(({ icon: Icon, title, description }) => (
						<div key={title} className="flex flex-col gap-3 bg-background p-6">
							<div className="flex size-9 items-center justify-center rounded-xl bg-primary/15 text-lime-700 dark:text-primary">
								<Icon className="size-4.5" />
							</div>
							<h3 className="font-semibold">{title}</h3>
							<p className="text-muted-foreground text-sm">{description}</p>
						</div>
					))}
				</div>
			</Section>
			<Section eyebrow="Get started" title="Pick your path">
				<div className="grid gap-4 md:grid-cols-2">
					<PathCard
						icon={CodeXml}
						title="C++ header-only library"
						description="For any C++17 project. Requires standalone Asio 1.34+ and, optionally, OpenSSL."
						href="/docs/setup"
						cta="Setup guide"
						items={[
							"UDP, TCP, HTTP & WebSocket",
							"Server and client classes",
							"Callback based, multi-threaded",
						]}
					/>
					<PathCard
						icon={Gamepad2}
						title="Unreal Engine plugin"
						description="For Unreal Engine 4.27 and above. Use it from Blueprints or C++ through the subsystem."
						href="/docs/Unreal/about"
						cta="Plugin docs"
						items={[
							"Blueprint nodes for every module",
							"World subsystem factory",
							"JSON & utility function library",
						]}
					/>
				</div>
			</Section>
			<Showcase />
			<Footer />
		</HomeLayout>
	);
}

function Backdrop() {
	return (
		<div
			aria-hidden
			className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[680px] overflow-hidden"
		>
			<div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-size-[48px_48px] mask-[radial-gradient(ellipse_at_top,black_20%,transparent_70%)] opacity-60" />
			<div className="absolute top-[-200px] left-1/2 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
		</div>
	);
}

function Hero() {
	return (
		<section className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 pt-16 pb-20 md:pt-24 lg:grid-cols-[1fr_1.15fr]">
			<div className="flex flex-col items-start gap-6">
				<Badge variant="outline" className="h-6 gap-1.5 px-3 text-xs">
					<span className="size-1.5 rounded-full bg-primary" />
					C++17 · Asio non-boost · Unreal Engine 4.27+
				</Badge>
				<h1 className="text-balance font-bold text-4xl leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
					Networking for C++ and Unreal,{" "}
					<span className="bg-linear-to-r from-lime-600 to-green-700 dark:from-primary dark:to-chart-3 bg-clip-text text-transparent">
						without Boost.
					</span>
				</h1>
				<p className="max-w-xl text-lg text-muted-foreground">
					{appName} wraps standalone Asio into UDP, TCP, HTTP and WebSocket
					servers and clients — simple to use, while giving you full control
					over connections and messages.
				</p>
				<div className="flex flex-wrap gap-3">
					<Button
						size="lg"
						nativeButton={false}
						render={<Link to="/docs/$" params={{ _splat: "" }} />}
					>
						<BookOpen data-icon="inline-start" />
						Read the docs
						<ArrowRight data-icon="inline-end" />
					</Button>
					<Button
						size="lg"
						variant="outline"
						nativeButton={false}
						render={<a href={links.library} target="_blank" rel="noreferrer" />}
					>
						<GitHubIcon data-icon="inline-start" />
						Star on GitHub
					</Button>
				</div>
				<div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-muted-foreground text-sm">
					<a
						href={links.releases}
						target="_blank"
						rel="noreferrer"
						className="underline-offset-4 hover:text-foreground hover:underline"
					>
						Download releases
					</a>
					<Separator orientation="vertical" className="h-4" />
					<a
						href={links.fab}
						target="_blank"
						rel="noreferrer"
						className="underline-offset-4 hover:text-foreground hover:underline"
					>
						Get the plugin on Fab
					</a>
				</div>
			</div>

			<Card className="min-w-0 gap-0 py-0 shadow-2xl shadow-primary/5">
				<Tabs defaultValue="cpp" className="gap-0">
					<CardHeader className="flex items-center justify-between border-b py-3">
						<div className="flex items-center gap-1.5">
							<span className="size-3 rounded-full bg-red-500/70" />
							<span className="size-3 rounded-full bg-yellow-500/70" />
							<span className="size-3 rounded-full bg-green-500/70" />
						</div>
						<TabsList>
							<TabsTrigger value="cpp">C++</TabsTrigger>
							<TabsTrigger value="blueprint">Blueprint</TabsTrigger>
						</TabsList>
					</CardHeader>
					<TabsContent value="cpp" className="min-w-0">
						<div className="[&_figure]:my-0 [&_figure]:rounded-none [&_figure]:border-0 [&_figure]:bg-transparent [&_figure]:shadow-none">
							<DynamicCodeBlock lang="cpp" code={cppSample} />
						</div>
					</TabsContent>
					<TabsContent value="blueprint" className="min-w-0 p-3">
						<HeroGraph />
					</TabsContent>
				</Tabs>
			</Card>
		</section>
	);
}

const heroWires: Wire[] = [
	{ from: "create-exec", to: "write-exec", color: getPinMeta("exec").color },
	{
		from: "create-client",
		to: "write-target",
		color: getPinMeta("object").color,
	},
];

function HeroGraph() {
	const exec = { name: "", pintype: "exec" } as const;
	return (
		<BlueprintCanvas wires={heroWires} className="my-0">
			<div className="flex items-start gap-7">
				<BlueprintNode
					variant="function"
					icon={<FunctionIcon />}
					title="Create TCPClient"
					subtitle="Target is Internet Protocol Subsystem"
					inputs={[
						<PinRow key="exec" pin={exec} side="in" />,
						<PinRow
							key="target"
							pin={{ name: "Target", pintype: "object" }}
							side="in"
						/>,
					]}
					outputs={[
						<PinRow key="exec" pin={exec} side="out" anchorId="create-exec" />,
						<PinRow
							key="ret"
							pin={{ name: "Return Value", pintype: "object" }}
							side="out"
							anchorId="create-client"
						/>,
					]}
				/>
				<BlueprintNode
					className="mt-14"
					variant="function"
					icon={<FunctionIcon />}
					title="Write"
					subtitle="Target is TCPClient"
					inputs={[
						<PinRow key="exec" pin={exec} side="in" anchorId="write-exec" />,
						<PinRow
							key="target"
							pin={{ name: "Target", pintype: "object" }}
							side="in"
							anchorId="write-target"
						/>,
						<PinRow
							key="msg"
							pin={{ name: "Message", pintype: "fstring" }}
							side="in"
						/>,
						<PinRow
							key="cb"
							pin={{ name: "Callback", pintype: "delegate" }}
							side="in"
						/>,
					]}
					outputs={[
						<PinRow key="exec" pin={exec} side="out" />,
						<PinRow
							key="ret"
							pin={{ name: "Return Value", pintype: "bool" }}
							side="out"
						/>,
					]}
				/>
			</div>
		</BlueprintCanvas>
	);
}

function Section({
	eyebrow,
	title,
	description,
	children,
}: {
	eyebrow: string;
	title: string;
	description?: string;
	children: ReactNode;
}) {
	return (
		<section className="mx-auto w-full max-w-6xl px-6 py-14">
			<div className="mb-8 flex max-w-2xl flex-col gap-2">
				<span className="font-medium text-lime-700 dark:text-primary text-sm uppercase tracking-widest">
					{eyebrow}
				</span>
				<h2 className="text-balance font-bold text-3xl tracking-tight">
					{title}
				</h2>
				{description && <p className="text-muted-foreground">{description}</p>}
			</div>
			{children}
		</section>
	);
}

function ProtocolCard({ protocol }: { protocol: Protocol }) {
	const { icon: Icon, name, description, slug, ssl } = protocol;
	const docLinks = protocol.links ?? [
		{ label: "C++", splat: `Header/${slug}-server` },
		{ label: "Unreal", splat: `Unreal/${slug}-server` },
	];
	return (
		<Card className="transition-colors hover:ring-primary/40">
			<CardHeader>
				<div className="mb-2 flex items-center justify-between">
					<div className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-lime-700 dark:text-primary">
						<Icon className="size-5" />
					</div>
					{ssl && (
						<Badge variant="secondary">
							<ShieldCheck />
							SSL
						</Badge>
					)}
				</div>
				<CardTitle className="text-lg">{name}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardFooter className="mt-auto flex-wrap gap-2">
				{docLinks.map((link) => (
					<DocLink key={link.splat} splat={link.splat}>
						{link.label}
					</DocLink>
				))}
			</CardFooter>
		</Card>
	);
}

function DocLink({ splat, children }: { splat: string; children: ReactNode }) {
	return (
		<Button
			size="sm"
			variant="outline"
			nativeButton={false}
			render={<Link to="/docs/$" params={{ _splat: splat }} />}
		>
			{children}
			<ArrowRight data-icon="inline-end" />
		</Button>
	);
}

function PathCard({
	icon: Icon,
	title,
	description,
	href,
	cta,
	items,
}: {
	icon: LucideIcon;
	title: string;
	description: string;
	href: string;
	cta: string;
	items: string[];
}) {
	return (
		<Card className="relative overflow-hidden">
			<Icon
				aria-hidden
				className="absolute -top-6 -right-6 size-36 text-lime-700/10 dark:text-primary/5"
			/>
			<CardHeader>
				<div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
					<Icon className="size-5" />
				</div>
				<CardTitle className="text-xl">{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent>
				<ul className="flex flex-col gap-2 text-sm">
					{items.map((item) => (
						<li key={item} className="flex items-center gap-2">
							<span className="size-1.5 rounded-full bg-primary" />
							{item}
						</li>
					))}
				</ul>
			</CardContent>
			<CardFooter>
				<Button
					nativeButton={false}
					render={
						<Link
							to="/docs/$"
							params={{ _splat: href.replace("/docs/", "") }}
						/>
					}
				>
					{cta}
					<ArrowRight data-icon="inline-end" />
				</Button>
			</CardFooter>
		</Card>
	);
}

function Showcase() {
	const videos = [
		{
			title: "Library showcase",
			description: "The C++ library in action across every protocol.",
			href: links.showcase,
		},
		{
			title: "Unreal Engine showcase",
			description: "Building networked gameplay with the Blueprint nodes.",
			href: links.unrealShowcase,
		},
	];

	return (
		<Section eyebrow="Showcase" title="See it running">
			<div className="grid gap-4 md:grid-cols-2">
				{videos.map((video) => (
					<a
						key={video.title}
						href={video.href}
						target="_blank"
						rel="noreferrer"
						className="group"
					>
						<Card className="h-full flex-row items-center gap-4 px-6 transition-colors group-hover:ring-primary/40">
							<div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-red-500/15 text-red-500 transition-transform group-hover:scale-110">
								<Play className="size-5 fill-current" />
							</div>
							<div className="flex flex-col gap-1">
								<span className="font-semibold">{video.title}</span>
								<span className="text-muted-foreground text-sm">
									{video.description}
								</span>
							</div>
							<ArrowRight className="ml-auto size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
						</Card>
					</a>
				))}
			</div>
		</Section>
	);
}

function Footer() {
	return (
		<footer className="mt-10 border-t">
			<div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-muted-foreground text-sm sm:flex-row">
				<span className="flex items-center gap-2">
					<img
						src="/logo.png"
						alt=""
						width={20}
						height={20}
						className="size-5"
					/>
					{appName} · MIT on GitHub, Standard licence on Fab
				</span>
				<div className="flex items-center gap-4">
					<a
						href={links.fab}
						target="_blank"
						rel="noreferrer"
						className="inline-flex items-center gap-1.5 hover:text-foreground"
					>
						<Heart className="size-4" /> Support on Fab
					</a>
					<a
						href={links.author}
						target="_blank"
						rel="noreferrer"
						className="hover:text-foreground"
					>
						About the author
					</a>
				</div>
			</div>
		</footer>
	);
}

function GitHubIcon(props: React.ComponentProps<"svg">) {
	return (
		<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
			<path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.39-5.26 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
		</svg>
	);
}
