<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/state';
    import { surveys, recordAnswer } from '$lib/stores';
    import { goto } from '$app/navigation';
    import { m } from '$lib/paraglide/messages';
    import { resolveRoute } from '$app/paths';
    import * as Button from "$lib/components/ui/button";
    import { getContrastColor } from "$lib/utils/color.js";

    // Get surveyId from query parameter 'id'
    let surveyIdFromQuery = $derived(page.url.searchParams.get('id'));

    // Find the current survey from the surveys store using surveyIdFromQuery
    let survey = $derived(surveyIdFromQuery ? $surveys.find(s => s.id === surveyIdFromQuery) : undefined);

    let currentSurveyQuestion = $derived(survey?.question || '');
    let currentSurveyAnswers = $derived(survey?.answers || []);

    onMount(() => {
        const currentIdParam = page.url.searchParams.get('id');

        if (currentIdParam) {
            // Check if the survey is found after a delay (stores might take time to initialize)
            const timeoutId = setTimeout(() => {
                if (page.url.searchParams.get('id') === currentIdParam && !survey) {
                    alert(m.survey_not_found_message());
                    goto(resolveRoute('/', {}));
                }
            }, 250);

            return () => clearTimeout(timeoutId);
        } else {
            // If no 'id' query parameter, it's an invalid state for this page.
            alert(m.survey_not_found_message()); // Or a more specific "Survey ID missing" message
            goto(resolveRoute('/', {}));
        }
    });

    function handleAnswer(answerId: string) {
        const currentSurveyId = page.url.searchParams.get('id');
        if (!survey || !currentSurveyId) return;

        recordAnswer(currentSurveyId, answerId);
        // Navigate to results page using query parameter
        goto(resolveRoute(`/results?id=${currentSurveyId}`, {}));
    }
</script>

<svelte:head>
    <title>{survey ? survey.question : m.survey_not_found_title()} | {m.app_title()}</title>
</svelte:head>

{#if survey}
    <div class="w-full max-w-lg text-center">
        <h1 class="text-3xl sm:text-4xl font-bold mb-8" style="color: {getContrastColor(survey?.appearance.backgroundColor)};">
            {currentSurveyQuestion}
        </h1>

        <div class="flex flex-col sm:flex-row flex-wrap gap-4 justify-center">
            {#each currentSurveyAnswers as answer (answer.id)}
                <Button.Root
                    onclick={() => handleAnswer(answer.id)}
                    class="grow px-6 min-w-30 "
                    style="
                    background-color: {survey?.appearance.buttonColor || ''};
                    color: {getContrastColor(survey?.appearance.buttonColor)};
                    "
                    size="lg"
                    variant="default"
                >{answer.text}</Button.Root>
            {/each}
        </div>
    </div>
{:else}
    <p class="text-muted-foreground text-center py-4">
        {surveyIdFromQuery ? m.loading_survey_data() : m.survey_not_found_message()}
    </p>
{/if}
