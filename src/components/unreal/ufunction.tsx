import {
	BlueprintCanvas,
	BlueprintNode,
	FunctionIcon,
	type NodePin,
	PinRow,
} from "./node";

export interface FunctionProperties {
	name: string;
	/** Owning class, rendered as "Target is …". */
	className?: string;
	/** Pure functions have no exec pins and a green header. */
	pure?: boolean;
	inPins?: NodePin[];
	outPins?: NodePin[];
}

export function UFunction({
	name,
	className,
	pure = false,
	inPins = [],
	outPins = [],
}: FunctionProperties) {
	return (
		<BlueprintCanvas label={pure ? "Pure function" : "Function"}>
			<BlueprintNode
				variant={pure ? "pure" : "function"}
				icon={<FunctionIcon pure={pure} />}
				title={name}
				subtitle={className ? `Target is ${className}` : undefined}
				inputs={inPins.map((pin, i) => (
					<PinRow key={`${pin.name}-${i}`} pin={pin} side="in" />
				))}
				outputs={outPins.map((pin, i) => (
					<PinRow key={`${pin.name}-${i}`} pin={pin} side="out" />
				))}
			/>
		</BlueprintCanvas>
	);
}
