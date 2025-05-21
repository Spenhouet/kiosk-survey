<script lang="ts">
    import { surveyQuestion, surveyAnswers, recordAnswer, type AnswerOption } from '$lib/stores';
    import { goto } from '$app/navigation';
    import { m } from "$lib/paraglide/messages.js";
    import PillButton from '$lib/components/PillButton.svelte'; // Import PillButton

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
            <PillButton
                text={answer.text}
                onClick={() => handleAnswer(answer.id)}
            />
        {/each}
    </div>
</div>