<script lang="ts">
  import "../app.css";
  import { page } from '$app/state'; 
  import { m } from "$lib/paraglide/messages.js";
  import { getLocale, setLocale, locales } from "$lib/paraglide/runtime";
  import {Icon} from '@steeze-ui/svelte-icon';
  import { ListBullet, Sun, Moon } from '@steeze-ui/heroicons';
  import { surveys } from '$lib/stores'; 
  import { resolveRoute } from '$app/paths';
  import { ModeWatcher, toggleMode, mode   } from "mode-watcher";

  let { children } = $props();

  let isDarkMode = $derived(mode.current === 'dark');

  let currentLang = $state(getLocale());
  let surveyId = $derived(page.url.searchParams.get('id'));
  let currentSurvey = $derived(surveyId ? $surveys.find(s => s.id === surveyId) : undefined);
</script>

<ModeWatcher />
<div
  class="min-h-screen w-screen flex flex-col items-center justify-center relative p-4 sm:p-8 bg-white dark:bg-gray-900"
  style="background-color: {currentSurvey?.appearance.appBackgroundColor || ''};"
>
  <!-- Top Controls: Overview Icon Left, Language Switcher Right, Theme Toggle -->
  <div class="absolute top-4 left-0 w-full flex justify-between items-center px-4 sm:top-6 z-10">
    <!-- Overview Icon (Left) -->
    <div>
      {#if page.url.pathname !== resolveRoute('/', {})}
        <a href={resolveRoute('/', {})} aria-label={m.navigate_home_aria_label() ? m.navigate_home_aria_label() : 'Manage Surveys'} class="text-2xl sm:text-3xl text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors flex items-center">
          <Icon src={ListBullet} theme='outline' class='h-7 w-7 sm:h-8 sm:w-8' />
        </a>
      {/if}
    </div>
    <!-- Right Controls: Language Switcher and Theme Toggle -->
    <div class="flex items-center gap-4">
      <select bind:value={currentLang} onchange={(e) => setLocale(e.currentTarget.value as any)}
        class="bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-black dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block">
        {#each locales as tag}
          <option value={tag}>{m[`locale_name_${tag}`]()}</option>
        {/each}
      </select>
      <!-- Theme Toggle Button -->
      <button onclick={toggleMode} class="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400" aria-label={isDarkMode ? m.theme_switcher_to_light_aria_label() : m.theme_switcher_to_dark_aria_label()}>
        {#if isDarkMode}
          <Icon src={Sun} class="w-6 h-6" />
        {:else}
          <Icon src={Moon} class="w-6 h-6" />
        {/if}
      </button>
    </div>
  </div>

  {@render children()}
</div>
