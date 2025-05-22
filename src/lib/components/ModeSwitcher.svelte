<script lang="ts">
    import { Sun, Moon } from '@lucide/svelte';
    import { m } from "$lib/paraglide/messages.js";
    import { ModeWatcher, toggleMode, mode } from "mode-watcher";
    import * as Button from "$lib/components/ui/button";

    let isDarkMode = $derived(mode.current === 'dark');
</script>

<ModeWatcher />

<Button.Root variant="outline" size="icon" onclick={toggleMode} aria-label={isDarkMode ? m.theme_switcher_to_light_aria_label() : m.theme_switcher_to_dark_aria_label()}>
    {#if isDarkMode}
      <Sun class="h-[1.2rem] w-[1.2rem]" />
    {:else}
      <Moon class="h-[1.2rem] w-[1.2rem]" />
    {/if}
  </Button.Root>