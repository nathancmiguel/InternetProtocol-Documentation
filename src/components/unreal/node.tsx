import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { getPinMeta, type NodePin, PinIcon } from "./pins";

export type { NodePin, PinType } from "./pins";

/* -------------------------------------------------------------------------- */
/*                                   Canvas                                   */
/* -------------------------------------------------------------------------- */

type RegisterAnchor = (id: string, el: HTMLElement | null) => void;
const AnchorContext = createContext<RegisterAnchor | null>(null);

export interface Wire {
	from: string;
	to: string;
	color: string;
}

interface WirePath {
	d: string;
	color: string;
}

/** Dark, gridded surface that mimics the Unreal graph editor. */
export function BlueprintCanvas({
	children,
	wires,
	label = "Blueprint",
	className,
}: {
	children: ReactNode;
	wires?: Wire[];
	label?: string;
	className?: string;
}) {
	const contentRef = useRef<HTMLDivElement>(null);
	const anchors = useRef(new Map<string, HTMLElement>());
	const [paths, setPaths] = useState<WirePath[]>([]);

	const register = useCallback<RegisterAnchor>((id, el) => {
		if (el) anchors.current.set(id, el);
		else anchors.current.delete(id);
	}, []);

	useLayoutEffect(() => {
		const content = contentRef.current;
		if (!content || !wires?.length) return;

		const compute = () => {
			const origin = content.getBoundingClientRect();
			const center = (el: HTMLElement) => {
				const r = el.getBoundingClientRect();
				return {
					x: r.left + r.width / 2 - origin.left,
					y: r.top + r.height / 2 - origin.top,
				};
			};

			const next: WirePath[] = [];
			for (const wire of wires) {
				const a = anchors.current.get(wire.from);
				const b = anchors.current.get(wire.to);
				if (!a || !b) continue;
				const p = center(a);
				const q = center(b);
				const bend = Math.max(48, Math.abs(q.x - p.x) * 0.5);
				next.push({
					color: wire.color,
					d: `M ${p.x} ${p.y} C ${p.x + bend} ${p.y}, ${q.x - bend} ${q.y}, ${q.x} ${q.y}`,
				});
			}
			setPaths(next);
		};

		compute();
		const observer = new ResizeObserver(compute);
		observer.observe(content);
		return () => observer.disconnect();
	}, [wires]);

	return (
		<AnchorContext.Provider value={register}>
			<figure
				className={cn(
					"not-prose group/canvas relative my-6 overflow-hidden rounded-xl border border-white/10 bg-[#202020] shadow-inner",
					"bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(rgba(0,0,0,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.35)_1px,transparent_1px)]",
					"bg-size-[16px_16px,16px_16px,128px_128px,128px_128px]",
					className,
				)}
			>
				<div className="overflow-x-auto">
					<div
						ref={contentRef}
						className="relative inline-flex min-w-full items-start p-6 pb-9"
					>
						{paths.length > 0 && (
							<svg
								aria-hidden
								className="pointer-events-none absolute inset-0 size-full overflow-visible"
							>
								{paths.map((path) => (
									<path
										key={path.d}
										d={path.d}
										stroke={path.color}
										strokeWidth={2.5}
										fill="none"
										className="drop-shadow-[0_0_3px_rgba(0,0,0,0.8)]"
									/>
								))}
							</svg>
						)}
						{children}
					</div>
				</div>
				<figcaption className="pointer-events-none absolute right-3 bottom-1.5 select-none font-bold text-[11px] text-white/15 uppercase tracking-[0.3em]">
					{label}
				</figcaption>
			</figure>
		</AnchorContext.Provider>
	);
}

/* -------------------------------------------------------------------------- */
/*                                    Pins                                    */
/* -------------------------------------------------------------------------- */

function useAnchor(id?: string) {
	const register = useContext(AnchorContext);
	return useCallback(
		(el: HTMLElement | null) => {
			if (id && register) register(id, el);
		},
		[id, register],
	);
}

export function PinGlyph({
	pin,
	anchorId,
}: {
	pin: Pick<NodePin, "pintype">;
	anchorId?: string;
}) {
	const ref = useAnchor(anchorId);
	return (
		<span ref={ref} className="inline-flex">
			<PinIcon type={pin.pintype} />
		</span>
	);
}

export function PinRow({
	pin,
	side,
	anchorId,
}: {
	pin: NodePin;
	side: "in" | "out";
	anchorId?: string;
}) {
	const meta = getPinMeta(pin.pintype);
	const glyph = <PinGlyph pin={pin} anchorId={anchorId} />;
	const label = pin.name ? (
		<span className="whitespace-nowrap text-[12.5px] text-white/90 leading-none">
			{pin.name}
		</span>
	) : null;

	return (
		<Tooltip>
			<TooltipTrigger
				render={<div />}
				className={cn(
					"flex h-5 cursor-default items-center gap-1.5 rounded-sm px-0.5 transition-colors hover:bg-white/5",
					side === "out" && "justify-end",
				)}
			>
				{side === "in" ? (
					<>
						{glyph}
						{label}
					</>
				) : (
					<>
						{label}
						{glyph}
					</>
				)}
			</TooltipTrigger>
			<TooltipContent side={side === "in" ? "left" : "right"}>
				<span
					className="size-2 rounded-full"
					style={{ backgroundColor: meta.color }}
				/>
				<span className="font-medium">{pin.name || meta.label}</span>
				{pin.name && <span className="opacity-60">{meta.label}</span>}
			</TooltipContent>
		</Tooltip>
	);
}

/* -------------------------------------------------------------------------- */
/*                                    Node                                    */
/* -------------------------------------------------------------------------- */

export type NodeVariant = "function" | "pure" | "event" | "variable";

const headerColor: Record<NodeVariant, string> = {
	function: "47 108 192",
	pure: "74 150 56",
	event: "168 30 30",
	variable: "110 110 110",
};

export function FunctionIcon({ pure }: { pure?: boolean }) {
	return (
		<span
			aria-hidden
			className={cn(
				"font-serif text-[18px] italic leading-none drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)]",
				pure ? "text-lime-300" : "text-sky-300",
			)}
		>
			ƒ
		</span>
	);
}

export function EventIcon() {
	return (
		<svg aria-hidden viewBox="0 0 20 20" className="size-4 shrink-0">
			<rect
				y="10"
				width="14.14"
				height="14.14"
				rx="2"
				transform="rotate(-45 0 10)"
				fill="white"
			/>
			<path d="M18.18 10.1 10.6 17.1V3.1z" fill="#721616" />
			<path
				d="M3.03 10.08c0-1.1.9-2 2-2h6.08v4.04H5.03a2 2 0 0 1-2-2z"
				fill="#721616"
			/>
		</svg>
	);
}

export function BlueprintNode({
	variant,
	title,
	subtitle,
	icon,
	headerPin,
	inputs = [],
	outputs = [],
	className,
}: {
	variant: NodeVariant;
	title: ReactNode;
	subtitle?: ReactNode;
	icon?: ReactNode;
	headerPin?: ReactNode;
	inputs?: ReactNode[];
	outputs?: ReactNode[];
	className?: string;
}) {
	const rgb = headerColor[variant];
	const hasBody = inputs.length > 0 || outputs.length > 0;

	return (
		<div
			className={cn(
				"relative z-10 inline-flex min-w-40 flex-col overflow-hidden rounded-lg border border-black/80 bg-[#0d0d0d]/95 text-white shadow-[0_10px_30px_-6px_rgba(0,0,0,0.85)] ring-1 ring-white/10",
				className,
			)}
		>
			<div
				className="flex items-center gap-2 border-white/10 border-b px-3 py-1.5"
				style={{
					backgroundImage: `linear-gradient(90deg, rgb(${rgb} / 0.95), rgb(${rgb} / 0.55) 55%, rgb(${rgb} / 0.12))`,
				}}
			>
				{icon}
				<div className="flex min-w-0 flex-col gap-0.5 pr-4">
					<span className="whitespace-nowrap font-semibold text-[13px] leading-tight drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)]">
						{title}
					</span>
					{subtitle && (
						<span className="whitespace-nowrap text-[11px] text-white/65 italic leading-tight">
							{subtitle}
						</span>
					)}
				</div>
				{headerPin && <span className="ml-auto">{headerPin}</span>}
			</div>

			{hasBody && (
				<div className="flex justify-between gap-8 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),transparent)] px-2 py-2.5">
					<div className="flex flex-col gap-2">{inputs}</div>
					<div className="flex flex-col items-end gap-2">{outputs}</div>
				</div>
			)}
		</div>
	);
}
