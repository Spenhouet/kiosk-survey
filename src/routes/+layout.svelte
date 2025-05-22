<script lang="ts">
  import "../app.css";
  import { page } from '$app/state'; 
  import { m } from "$lib/paraglide/messages.js";
  import { getLocale, setLocale, locales } from "$lib/paraglide/runtime";
  import {Icon} from '@steeze-ui/svelte-icon';
  import { ListBullet } from '@steeze-ui/heroicons';
  import { surveys } from '$lib/stores';
  import { resolveRoute } from '$app/paths';

  let { children } = $props();

  let currentLang = $state(getLocale());

  let surveyId = page.url.searchParams.get('id');
  let currentSurvey = $derived(surveyId ? $surveys.find(s => s.id === surveyId) : undefined);
  let pageBackgroundColor = $derived(currentSurvey?.appearance.appBackgroundColor ?? 'initial');

</script>

<div class="min-h-screen w-screen flex flex-col items-center justify-center relative p-4 sm:p-8" style="background-color: {pageBackgroundColor};">
  
  <!-- Top Controls: Overview Icon Left, Language Switcher Right -->
  <div class="absolute top-4 left-0 w-full flex justify-between items-center px-4 sm:top-6 z-10">
  <!-- Overview Icon (Left) -->
  <div>
    {#if page.url.pathname !== resolveRoute('/', {})}
    <a href={resolveRoute('/', {})} aria-label={m.navigate_home_aria_label() ? m.navigate_home_aria_label() : 'Manage Surveys'} class="text-2xl sm:text-3xl text-gray-300 hover:text-white transition-colors flex items-center">
    <Icon src={ListBullet} theme='outline' class='h-7 w-7 sm:h-8 sm:w-8' />
    </a>
    {/if}
  </div>
  <!-- Language Switcher (Right) -->
  <div>
    <select bind:value={currentLang} onchange={(e) => setLocale(e.currentTarget.value as any)}
    class="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block">
    {#each locales as tag}
      <option value={tag}>{m[`locale_name_${tag}`]()}</option>
    {/each}
    </select>
  </div>
  </div>

  {@render children()}
</div>
