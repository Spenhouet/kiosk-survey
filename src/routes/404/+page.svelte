<script lang="ts">
	import { goto } from '$app/navigation';
    import { m } from "$lib/paraglide/messages.js";
    import { resolveRoute } from '$app/paths';


	function goHome() {
		goto(resolveRoute('/', {}));
	}
</script>

<div class="flex flex-col items-center justify-center h-screen text-center">
	<h1 class="text-4xl font-bold mb-4">{m.notFoundTitle()}</h1>
	<p class="text-lg mb-8">{m.notFoundText()}</p>
	<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" on:click={goHome}>
		{m.goToHomepageButton()}
	</button>
</div>