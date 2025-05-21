<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/state';
    import { surveys, recordAnswer } from '$lib/stores';
    import { goto } from '$app/navigation';
    import { m } from '$lib/paraglide/messages';
    import PillButton from '$lib/components/PillButton.svelte';

    let surveyId = $derived(page.params.surveyId);
    
    // survey will be undefined if surveyIdFromParams is not (yet) valid OR if no survey with that ID exists in $surveys
    let survey = $derived(surveyId ? $surveys.find(s => s.id === surveyId) : undefined);

    let currentSurveyQuestion = $derived(survey?.question || '');
    let currentSurveyAnswers = $derived(survey?.answers || []);

    onMount(() => {
        const currentParamId = page.params.surveyId; // Capture current param at mount time

        if (currentParamId) {
            // Fallback: If after a short delay, the survey (derived from params) is not found,
            // and we are still on the same page, then navigate.
            const timeoutId = setTimeout(() => {
                if (page.params.surveyId === currentParamId && !survey) { 
                    alert(m.survey_not_found_message());
                    goto('/');
                }
            }, 200); // Increased timeout slightly for store hydration

            return () => clearTimeout(timeoutId); // Cleanup timeout on component destroy
        } else {
            // If there's no surveyId in params when the page mounts, it's an invalid state.
            // The derived `survey` will be undefined, leading to the 'else' block in the template.
            // A more aggressive redirect could be placed here if needed.
            // console.warn('Survey page mounted without a surveyId in params.');
        }
    });

    function handleAnswer(answerId: string) {
        if (!survey || !surveyId) return; // Ensure survey and its ID are available
        recordAnswer(surveyId, answerId); 
        goto(`/survey/${surveyId}/results`);
    }
</script>

<svelte:head>
    <title>{survey ? survey.name : m.survey_not_found_title()} | {m.app_title()}</title>
</svelte:head>

{#if survey}
    <div class="w-full max-w-lg text-center">
        <h1 class="text-3xl sm:text-4xl font-bold mb-8 text-gray-100">
            {currentSurveyQuestion}
        </h1>

        <div class="flex flex-col gap-4">
            {#each currentSurveyAnswers as answer (answer.id)} 
                <PillButton
                    text={answer.text}
                    onClick={() => handleAnswer(answer.id)} 
                />
            {/each}
        </div>
    </div>
{:else}
    <p class="text-gray-400 text-center py-4">{surveyId ? m.loading_survey_data() : m.survey_not_found_message()}</p> 
{/if}
