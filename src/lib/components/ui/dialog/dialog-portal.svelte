<script lang="ts">
	import { Dialog as DialogPrimitive } from "bits-ui-old";
	type $$Props = DialogPrimitive.PortalProps;
</script>

<DialogPrimitive.Portal {...$$restProps}>
	<slot />
</DialogPrimitive.Portal>
