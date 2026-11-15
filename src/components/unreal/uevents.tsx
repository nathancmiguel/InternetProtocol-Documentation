import {
	BlueprintCanvas,
	BlueprintNode,
	EventIcon,
	FunctionIcon,
	type NodePin,
	PinGlyph,
	PinRow,
	type Wire,
} from "./node";
import { getPinMeta } from "./pins";

interface EventProperties {
	name: string;
	/** Also render the "Bind Event to …" node wired to the custom event. */
	showBindNode?: boolean;
	outPins?: NodePin[];
}

const wires: Wire[] = [
	{ from: "event", to: "bind", color: getPinMeta("delegate").color },
];

export function UEvents({
	name,
	showBindNode = false,
	outPins = [],
}: EventProperties) {
	const eventNode = (
		<BlueprintNode
			variant="event"
			icon={<EventIcon />}
			title={name}
			subtitle="Custom Event"
			headerPin={
				<PinGlyph
					pin={{ pintype: "delegate" }}
					anchorId={showBindNode ? "event" : undefined}
				/>
			}
			outputs={outPins.map((pin, i) => (
				<PinRow key={`${pin.name}-${i}`} pin={pin} side="out" />
			))}
		/>
	);

	if (!showBindNode) {
		return <BlueprintCanvas label="Event">{eventNode}</BlueprintCanvas>;
	}

	return (
		<BlueprintCanvas label="Event binding" wires={wires}>
			<div className="grid grid-cols-[auto_auto] gap-x-16 gap-y-6">
				<BlueprintNode
					className="col-start-2 row-start-1"
					variant="function"
					icon={<FunctionIcon />}
					title={`Bind Event to ${name}`}
					inputs={[
						<PinRow key="exec" pin={{ name: "", pintype: "exec" }} side="in" />,
						<PinRow
							key="target"
							pin={{ name: "Target", pintype: "object" }}
							side="in"
						/>,
						<PinRow
							key="event"
							pin={{ name: "Event", pintype: "delegate" }}
							side="in"
							anchorId="bind"
						/>,
					]}
					outputs={[
						<PinRow
							key="exec"
							pin={{ name: "", pintype: "exec" }}
							side="out"
						/>,
					]}
				/>
				<div className="col-start-1 row-start-2">{eventNode}</div>
			</div>
		</BlueprintCanvas>
	);
}
