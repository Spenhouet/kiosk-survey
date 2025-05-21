<script lang="ts">
    import { surveys } from '$lib/stores';
    import { goto } from '$app/navigation';
    import { m } from "$lib/paraglide/messages.js";
    import { page } from '$app/state';
    import PillButton from '$lib/components/PillButton.svelte';

    // Get surveyId from route params
    const surveyId = $derived(page.params.surveyId);

    // Find the current survey from the surveys store
    let currentSurvey = $derived($surveys.find(s => s.id === surveyId));

    let currentPillButtonColor = $derived.by(() => {
        const currentSurveyId = page.params.surveyId; // Get surveyId from page store
        if (!currentSurveyId) return '#007bff'; // Default color if no surveyId in route
        const currentSurvey = $surveys.find(s => s.id === currentSurveyId);
        return currentSurvey ? currentSurvey.appearance.pillButtonColor : '#007bff'; // Default if survey not found
    });

    // Svelte 5 derived state from currentSurvey
    let totalVotes = $derived(currentSurvey ? Object.values(currentSurvey.results).reduce((sum, count) => sum + count, 0) : 0);

    function getAnswerDisplay(answerId: string): { text: string } {
        if (!currentSurvey) return { text: "Unknown Option" };
        const answer = currentSurvey.answers.find(a => a.id === answerId);
        return answer
            ? { text: answer.text || "Unknown" }
            : { text: "Unknown Option" };
    }
</script>
<svelte:head>
    <title>{m.results_page_title()} | {m.app_title()}</title>
</svelte:head>

{#if currentSurvey}
    <div class="w-full max-w-xl text-center">
        <h2 class="text-2xl sm:text-3xl font-bold mb-6 text-gray-200">
            {m.results_page_title()}: {currentSurvey.question}
        </h2>

        {#if totalVotes > 0}
            <div class="space-y-4 p-6">
                {#each currentSurvey.answers as answer (answer.id)}
                    {@const votes = currentSurvey.results[answer.id] || 0}
                    {@const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0}
                    {@const display = getAnswerDisplay(answer.id)}
                    <div class="text-left">
                        <div class="flex justify-between items-center mb-1 text-gray-100">
                            <span class="text-md sm:text-lg">
                                {display.text}: {votes} {votes === 1 ? m.votes_suffix_singular() : m.votes_suffix_plural()}
                            </span>
                            {#if percentage > 0}<span class="text-sm text-gray-300">{percentage.toFixed(1)}%</span>{/if}
                        </div>
                        <div class="w-full bg-gray-600 rounded-full h-6 sm:h-8 relative overflow-hidden">
                            <div
                                class="h-full rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-2"
                                style:width="{percentage}%"
                                style="--pill-bg-color: {currentPillButtonColor}; background-color: var(--pill-bg-color);"
                            >
                                {#if percentage > 15}
                                    <span class="text-xs font-medium text-white whitespace-nowrap">{percentage.toFixed(1)}%</span>
                                {/if}
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
            <p class="text-gray-300">{m.total_votes_label({ count: totalVotes })}</p>
        {:else}
            <p class="text-xl text-gray-400 my-8">{m.no_responses_message()}</p>
        {/if}

        <PillButton
            onClick={() => goto(`/survey/${surveyId}`)}
            customClass="mt-8 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
        >
            {m.repeat_survey_button()}
        </PillButton>
    </div>
{:else}
    <p class="text-xl text-gray-400 my-8">{m.loading_survey_data()}</p>
{/if}