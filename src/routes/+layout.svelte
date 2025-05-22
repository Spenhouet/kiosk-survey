<script lang="ts">
  import "../app.css";
  import { page } from '$app/state'; 
  import { m } from "$lib/paraglide/messages.js";
  import { getLocale, setLocale, locales } from "$lib/paraglide/runtime";
  import { Sun, Moon, List } from 'lucide-svelte';
  import { surveys } from '$lib/stores'; 
  import { resolveRoute } from '$app/paths';
  import { ModeWatcher, toggleMode, mode } from "mode-watcher";
  import * as Button from "$lib/components/ui/button";
  import * as Select from "$lib/components/ui/select";
  
  let { children } = $props();
  
  let isDarkMode = $derived(mode.current === 'dark');
  
  let currentLang = $state(getLocale());
  let surveyId = $derived(page.url.searchParams.get('id'));
  let currentSurvey = $derived(surveyId ? $surveys.find(s => s.id === surveyId) : undefined);
  
  function handleLanguageChange(value: string | undefined) {
    if (value) {
      setLocale(value as any);
      // currentLang will be updated by the reactive $state variable when getLocale() changes
    }
  }
</script>

<ModeWatcher />
<div
  class="min-h-screen w-screen flex flex-col items-center justify-center relative p-4 sm:p-8 bg-background text-foreground"
  style="background-color: {currentSurvey?.appearance.appBackgroundColor || ''};"
>
  <!-- Top Controls: Overview Icon Left, Language Switcher Right, Theme Toggle -->
  <div class="absolute top-4 left-0 w-full flex justify-between items-center px-4 sm:top-6 z-10">
    <!-- Overview Icon (Left) -->
    <div>
      {#if page.url.pathname !== resolveRoute('/', {})}
        <Button.Root href={resolveRoute('/', {})} variant="ghost" size="icon" aria-label={m.navigate_home_aria_label() ? m.navigate_home_aria_label() : 'Manage Surveys'}>
          <List class='h-7 w-7 sm:h-8 sm:w-8' />
        </Button.Root>
      {/if}
    </div>
    <!-- Right Controls: Language Switcher and Theme Toggle -->
    <div class="flex items-center gap-4">
      <Select.Root value={currentLang} onValueChange={handleLanguageChange}>
        <Select.Trigger class="w-[180px]">
          <Select.Value placeholder={m.select_language_placeholder()} />
        </Select.Trigger>
        <Select.Content>
          {#each locales as tag}
            <Select.Item value={tag}>{m[`locale_name_${tag}`]()}</Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
      <!-- Theme Toggle Button -->
      <Button.Root variant="outline" size="icon" onclick={toggleMode} aria-label={isDarkMode ? m.theme_switcher_to_light_aria_label() : m.theme_switcher_to_dark_aria_label()}>
        {#if isDarkMode}
          <Sun class="h-[1.2rem] w-[1.2rem]" />
        {:else}
          <Moon class="h-[1.2rem] w-[1.2rem]" />
        {/if}
      </Button.Root>
    </div>
  </div>

  {@render children()}
</div>
