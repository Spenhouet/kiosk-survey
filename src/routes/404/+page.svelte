<script lang="ts">
	import { goto } from '$app/navigation';
	import { m } from '$lib/paraglide/messages.js';
	import { resolveRoute } from '$app/paths';
	import * as Button from '$lib/components/ui/button';

	function goHome() {
		goto(resolveRoute('/', {}));
	}
</script>

<div class="flex flex-col items-center justify-center h-screen text-center">
	<h1 class="text-4xl font-bold mb-4">{m.notFoundTitle()}</h1>
	<p class="text-lg mb-8 text-muted-foreground">{m.notFoundText()}</p>
	<Button.Root on:click={goHome}>
		{m.goToHomepageButton()}
	</Button.Root>
</div>