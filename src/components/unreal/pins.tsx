import { cn } from "@/lib/utils";

const scalarTypes = {
	exec: { label: "Exec", color: "#ffffff" },
	delegate: { label: "Delegate", color: "#ff3838" },
	bool: { label: "Boolean", color: "#c40000" },
	byte: { label: "Byte", color: "#00a08f" },
	/** Unreal draws enum pins with the byte color. */
	enum: { label: "Enum", color: "#00a08f" },
	int: { label: "Integer", color: "#1fe3af" },
	int64: { label: "Integer64", color: "#a9f5ac" },
	float: { label: "Float", color: "#a1ff45" },
	fstring: { label: "String", color: "#f00acb" },
	struct: { label: "Structure", color: "#1d6fe0" },
	object: { label: "Object Reference", color: "#00aaf5" },
	class: { label: "Class Reference", color: "#8e1fd8" },
	default: { label: "Wildcard", color: "#9a9a9a" },
} as const;

type ScalarType = keyof typeof scalarTypes;

const arrayTypes = {
	array: "default",
	boolarray: "bool",
	bytearray: "byte",
	intarray: "int",
	int64array: "int64",
	floatarray: "float",
	fstringarray: "fstring",
	objectarray: "object",
	objectgarray: "object",
} as const satisfies Record<string, ScalarType>;

const setTypes = {
	setobject: "object",
} as const satisfies Record<string, ScalarType>;

const aliases = {
	boolean: "bool",
} as const satisfies Record<string, ScalarType>;

export type PinType =
	| ScalarType
	| keyof typeof arrayTypes
	| keyof typeof setTypes
	| keyof typeof aliases;

export interface NodePin {
	name: string;
	pintype: PinType;
}

type Container = "single" | "array" | "set";

export interface PinMeta {
	base: ScalarType;
	container: Container;
	color: string;
	label: string;
}

export function getPinMeta(type: PinType): PinMeta {
	let base: ScalarType = "default";
	let container: Container = "single";

	if (type in scalarTypes) base = type as ScalarType;
	else if (type in aliases) base = aliases[type as keyof typeof aliases];
	else if (type in arrayTypes) {
		base = arrayTypes[type as keyof typeof arrayTypes];
		container = "array";
	} else if (type in setTypes) {
		base = setTypes[type as keyof typeof setTypes];
		container = "set";
	}

	const { label, color } = scalarTypes[base];
	const prefix =
		container === "array" ? "Array of " : container === "set" ? "Set of " : "";

	return { base, container, color, label: `${prefix}${label}` };
}

/** Unreal style pin glyph, drawn inline so it scales and themes cleanly. */
export function PinIcon({
	type,
	className,
}: {
	type: PinType;
	className?: string;
}) {
	const { base, container, color } = getPinMeta(type);
	const common = {
		viewBox: "0 0 16 16",
		fill: "none",
		className: cn("size-3.5 shrink-0", className),
	} as const;

	if (base === "exec") {
		return (
			<svg
				aria-hidden="true"
				{...common}
				className={cn(common.className, "size-4")}
			>
				<path
					d="M2.5 2.75h6l5 5.25-5 5.25h-6z"
					stroke={color}
					strokeWidth={1.6}
					strokeLinejoin="round"
				/>
			</svg>
		);
	}

	if (container === "array") {
		return (
			<svg aria-hidden="true" {...common}>
				{[0, 1, 2].flatMap((row) =>
					[0, 1, 2].map((col) => (
						<rect
							key={`${row}-${col}`}
							x={1.5 + col * 4.5}
							y={1.5 + row * 4.5}
							width={3.5}
							height={3.5}
							rx={0.6}
							fill={row === 1 && col === 1 ? "transparent" : color}
							stroke={color}
							strokeWidth={0.8}
						/>
					)),
				)}
			</svg>
		);
	}

	if (container === "set") {
		return (
			<svg aria-hidden="true" {...common}>
				<path
					d="M6.2 2C4.6 2 4.4 2.9 4.4 4.1v1.8c0 1-.6 1.9-1.9 2.1 1.3.2 1.9 1.1 1.9 2.1v1.8c0 1.2.2 2.1 1.8 2.1M9.8 2c1.6 0 1.8.9 1.8 2.1v1.8c0 1 .6 1.9 1.9 2.1-1.3.2-1.9 1.1-1.9 2.1v1.8c0 1.2-.2 2.1-1.8 2.1"
					stroke={color}
					strokeWidth={1.5}
					strokeLinecap="round"
				/>
			</svg>
		);
	}

	if (base === "delegate") {
		return (
			<svg aria-hidden="true" {...common}>
				<rect
					x={2.5}
					y={2.5}
					width={11}
					height={11}
					rx={2}
					stroke={color}
					strokeWidth={2}
				/>
			</svg>
		);
	}

	return (
		<svg aria-hidden="true" {...common}>
			<circle cx={7} cy={8} r={4.4} stroke={color} strokeWidth={1.8} />
			<path d="M13.1 8 11.4 6.3v3.4z" fill={color} />
		</svg>
	);
}
