<script lang="ts">
    import { surveys } from '$lib/stores';
    import { goto } from '$app/navigation';
    import { m } from "$lib/paraglide/messages.js";
    import { page } from '$app/state';
    import { resolveRoute } from '$app/paths';
    import * as Button from "$lib/components/ui/button";
    import * as Progress from "$lib/components/ui/progress";
    import { getContrastColor } from "$lib/utils/color.js";

    let surveyIdFromQuery = $derived(page.url.searchParams.get('id'));
    let survey = $derived(surveyIdFromQuery ? $surveys.find(s => s.id === surveyIdFromQuery) : undefined);
    let totalVotes = $derived(survey ? Object.values(survey.results).reduce((sum, count) => sum + count, 0) : 0);

    function getAnswerDisplay(answerId: string): { text: string } {
        if (!survey) return { text: "Unknown Option" };
        const answer = survey.answers.find(a => a.id === answerId);
        return answer
            ? { text: answer.text || "Unknown" }
            : { text: "Unknown Option" };
    }
</script>
<svelte:head>
    <title>{m.results_page_title()} | {m.app_title()}</title>
</svelte:head>

{#if survey}
    <div class="w-full max-w-xl text-center">
        <h2 class="text-2xl sm:text-3xl font-bold mb-6" style="color: {getContrastColor(survey?.appearance.backgroundColor)};">
            {survey.question}
        </h2>

        {#if totalVotes > 0}
            <div class="space-y-4 p-6">
                {#each survey.answers as answer (answer.id)}
                    {@const votes = survey.results[answer.id] || 0}
                    {@const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0}
                    {@const display = getAnswerDisplay(answer.id)}
                    <div class="text-left">
                        <div class="flex justify-between items-center mb-1">
                            <span class="text-md sm:text-lg" style="color: {getContrastColor(survey?.appearance.backgroundColor)};">
                                {display.text}: {votes} {votes === 1 ? m.votes_suffix_singular() : m.votes_suffix_plural()}
                            </span>
                            {#if percentage > 0}
                            <span class="text-md sm:text-lg" style="color: {getContrastColor(survey?.appearance.backgroundColor)};">
                                {percentage.toFixed(1)}%
                            </span>
                            {/if}
                        </div>
                        <Progress.Root value={percentage} class="h-6 sm:h-8" style="background-color: {survey?.appearance.buttonColor || ''};" />
                    </div>
                {/each}
            </div>
            <p class="" style="color: {getContrastColor(survey?.appearance.backgroundColor)};">
                {m.total_votes_label({ count: totalVotes })}
            </p>
        {:else}
            <p class="text-xl text-muted-foreground my-8">{m.no_responses_message()}</p>
        {/if}

        <Button.Root
            onclick={() => goto(resolveRoute(`/survey?id=${surveyIdFromQuery}`, {}))}
            class="mt-8"
            style="
            background-color: {survey?.appearance.buttonColor || ''};
            color: {getContrastColor(survey?.appearance.buttonColor)};
            "
            size="lg" 
        >
            {m.repeat_survey_button()}
        </Button.Root>
    </div>
{:else}
    <p class="text-xl text-muted-foreground my-8">{m.loading_survey_data()}</p>
{/if}
