<script lang="ts">
	import { Dialog as DialogPrimitive } from "bits-ui-old";
	import { cn } from "$lib/utils.js";

	type $$Props = DialogPrimitive.DescriptionProps;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<DialogPrimitive.Description
	class={cn("text-muted-foreground text-sm", className)}
	{...$$restProps}
>
	<slot />
</DialogPrimitive.Description>
