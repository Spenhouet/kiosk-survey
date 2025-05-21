<script lang="ts">
    import { surveyQuestion, surveyAnswers, recordAnswer, type AnswerOption } from '$lib/stores';
    import { goto } from '$app/navigation';
    import { m } from "$lib/paraglide/messages.js";

    function handleAnswer(answerId: string) {
        recordAnswer(answerId);
        goto(`/results`); // Navigate to lang-prefixed results
    }

</script>

<svelte:head>
    <title>{m.survey_page_title()} | {m.app_title()}</title>
</svelte:head>

<div class="w-full max-w-lg text-center">
    <h1 class="text-3xl sm:text-4xl font-bold mb-8 text-gray-100">
        {$surveyQuestion}
    </h1>

    <div class="flex flex-col gap-4">
        {#each $surveyAnswers as answer (answer.id)}
            <button
                on:click={() => handleAnswer(answer.id)}
                class="w-full p-3 sm:p-4 text-lg rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-150 ease-in-out shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
            >
                {answer.text}
            </button>
        {/each}
    </div>
</div>