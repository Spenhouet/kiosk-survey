<script lang="ts">
  import "../app.css";
  import { page } from '$app/stores'; 
  import { m } from "$lib/paraglide/messages.js";
  import { getLocale, setLocale, locales } from "$lib/paraglide/runtime";
  import {Icon} from '@steeze-ui/svelte-icon';
  import { Cog6Tooth } from '@steeze-ui/heroicons';
  import { surveys } from '$lib/stores';

  let { children } = $props();

  let currentLang = $state(getLocale());

  let appBackgroundColor = $derived.by(() => {
    const currentSurveyId = $page.params.surveyId;
    if (!currentSurveyId) return '#282c34'; 
    const currentSurvey = $surveys.find(s => s.id === currentSurveyId);
    return currentSurvey ? currentSurvey.appearance.appBackgroundColor : '#282c34';
  });

  $effect(() => {
      document.body.style.backgroundColor = appBackgroundColor;
  });

</script>

<div class="min-h-screen w-screen flex flex-col items-center justify-center relative p-4 sm:p-8">
  {#if !$page.url.pathname.startsWith('/survey/') && !$page.url.pathname.startsWith('/settings') && !$page.url.pathname.startsWith('/results') && $page.url.pathname !== '/'}
      <div class="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 flex items-center space-x-4">
          <a href="/" aria-label={m.surveys_page_title() ? m.surveys_page_title() : 'Manage Surveys'} class="text-2xl sm:text-3xl text-gray-300 hover:text-white transition-colors">
            <Icon src={Cog6Tooth} theme='outline' class='h-7 w-7 sm:h-8 sm:w-8' />
        </a>
      </div>
  {/if}

  <!-- Language Switcher -->
  <div class="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
      <select bind:value={currentLang} on:change={(e) => setLocale(e.currentTarget.value as any)}
          class="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2">
          {#each locales as tag}
              <option value={tag}>{m[`locale_name_${tag}`]()}</option>
          {/each}
      </select>
  </div>
  {@render children()}
</div>