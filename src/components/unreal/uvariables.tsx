import { BlueprintCanvas, BlueprintNode, type NodePin, PinRow } from "./node";
import { getPinMeta, PinIcon } from "./pins";

export interface VarProperties {
	pin: NodePin;
	/** `true` renders a getter pill, `false` a SET node. Defaults to getter. */
	get?: boolean;
}

export function UVar({ pin, get = true }: VarProperties) {
	const { color } = getPinMeta(pin.pintype);

	if (!get) {
		return (
			<BlueprintCanvas label="Variable">
				<BlueprintNode
					variant="variable"
					title="SET"
					inputs={[
						<PinRow key="exec" pin={{ name: "", pintype: "exec" }} side="in" />,
						<PinRow key="value" pin={pin} side="in" />,
					]}
					outputs={[
						<PinRow
							key="exec"
							pin={{ name: "", pintype: "exec" }}
							side="out"
						/>,
						<PinRow key="value" pin={{ ...pin, name: "" }} side="out" />,
					]}
				/>
			</BlueprintCanvas>
		);
	}

	return (
		<BlueprintCanvas label="Variable">
			<div
				className="relative z-10 inline-flex items-center gap-2 rounded-full border border-black/80 py-1.5 pr-2.5 pl-4 text-white shadow-[0_10px_30px_-6px_rgba(0,0,0,0.85)] ring-1 ring-white/15"
				style={{
					backgroundImage: `linear-gradient(90deg, ${color}40, #151515 45%, #0b0b0b)`,
				}}
			>
				<span className="whitespace-nowrap font-medium text-[12.5px]">
					{pin.name}
				</span>
				<PinIcon type={pin.pintype} />
			</div>
		</BlueprintCanvas>
	);
}
