<script lang="ts">
  import { m } from "$lib/paraglide/messages.js";
  import { getLocale, setLocale, locales } from "$lib/paraglide/runtime";
  import * as Select from "$lib/components/ui/select";
	import { cn } from "$lib/utils.js";

  let {
		class: className,
	} = $props();
  
  function handleLanguageChange(value: string | undefined) {
    if (value) {
      setLocale(value as any);
    }
  }

  let currentLang = $state(getLocale());
</script>

<Select.Root type="single" name="language" value={currentLang} onValueChange={handleLanguageChange}>
  <Select.Trigger class={cn("w-[180px] bg-secondary dark:bg-secondary text-secondary-foreground dark:text-secondary-foreground shadow-xs hover:bg-secondary/80 dark:hover:bg-secondary/80", className)}>
    {m[`locale_name_${currentLang}`]()}
  </Select.Trigger>
  <Select.Content>
    <Select.Label>{m.select_language_placeholder()}</Select.Label>
    {#each locales as tag}
      <Select.Item value={tag}>{m[`locale_name_${tag}`]()}</Select.Item>
    {/each}
  </Select.Content>
</Select.Root>