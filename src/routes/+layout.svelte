<script lang="ts">
  import "../app.css";
  import { page } from '$app/state'; 
  import { m } from "$lib/paraglide/messages.js";
  import { List } from '@lucide/svelte';
  import { surveys } from '$lib/stores'; 
  import { resolveRoute } from '$app/paths';
  import * as Button from "$lib/components/ui/button";
  import ModeSwitcher from "$lib/components/ModeSwitcher.svelte";
  import LanguageSwitcher from "$lib/components/LanguageSwitcher.svelte";
  
  let { children } = $props();
  
  let surveyId = $derived(page.url.searchParams.get('id'));
  let currentSurvey = $derived(surveyId ? $surveys.find(s => s.id === surveyId) : undefined);
  
</script>


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
      <LanguageSwitcher />
      <ModeSwitcher />
    </div>
  </div>

  {@render children()}
</div>
