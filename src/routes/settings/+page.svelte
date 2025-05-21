<script lang="ts">
    import {
        surveyQuestion,
        surveyAnswers,
        appBackgroundColor,
        resetResults,
        resetSurveyToDefaults,
        type AnswerOption
    } from '$lib/stores';
    import { goto } from '$app/navigation';
    import { m } from "$lib/paraglide/messages.js";
    import { tick } from 'svelte'; // For focus management
    import {Icon} from '@steeze-ui/svelte-icon'
    import { Trash } from '@steeze-ui/heroicons'

    // Svelte 5 state for local component logic
    let newAnswerText = $state('');
    let showConfirmClear = $state(false);
    let showConfirmResetSurvey = $state(false);

    // Svelte 5 reactive bindings:
    // bind:value for inputs on $surveyQuestion and $appBackgroundColor is fine.
    // For the array $surveyAnswers, we need to be careful.
    // Direct binding like `bind:value={$surveyAnswers[i].text}` won't trigger store update.
    // We need to explicitly call surveyAnswers.update() or create new array.

    function addAnswer() {
        if (!newAnswerText.trim()) return;
        const newAnswer: AnswerOption = {
            id: crypto.randomUUID(),
            text: newAnswerText.trim(),
        };
        // Svelte 5: to update a store, call its update or set method
        surveyAnswers.update(current => [...current, newAnswer]);
        newAnswerText = '';
    }

    function removeAnswer(idToRemove: string) {
        surveyAnswers.update(current => current.filter(answer => answer.id !== idToRemove));
    }

    function updateAnswerProperty(index: number, prop: 'text', value: string) {
        surveyAnswers.update(currentAnswers => {
            const newAnswers = [...currentAnswers]; // Create a new array to ensure reactivity
            const updatedAnswer = { ...newAnswers[index] }; // Clone the specific answer
            updatedAnswer.text = value;
            newAnswers[index] = updatedAnswer;
            return newAnswers;
        });
    }

    async function confirmClearResults() {
        resetResults();
        showConfirmClear = false;
        await tick(); // Wait for DOM update
        alert(m.confirm_clear_results_message()); // This alert isn't ideal UX, consider a toast
    }
    async function confirmResetSurvey() {
        resetSurveyToDefaults();
        showConfirmResetSurvey = false;
        await tick();
        alert(m.confirm_reset_survey_message());
    }
</script>

<svelte:head>
    <title>{m.settings_page_title()} | {m.app_title()}</title>
</svelte:head>

<div class="w-full max-w-2xl bg-gray-700 p-6 sm:p-8 rounded-lg shadow-xl space-y-8">
    <h2 class="text-2xl sm:text-3xl font-bold text-center text-gray-100">{m.settings_page_title()}</h2>

    <!-- Edit Question -->
    <section>
        <label for="surveyQuestion" class="block text-lg font-medium text-gray-200 mb-2">{m.edit_question_label()}</label>
        <textarea
            id="surveyQuestion"
            bind:value={$surveyQuestion}
            rows="2"
            placeholder={m.edit_question_label()}
            class="w-full p-3 bg-gray-600 border border-gray-500 rounded-md text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
        ></textarea>
    </section>

    <!-- Edit Answer Options -->
    <section>
        <h3 class="text-lg font-medium text-gray-200 mb-3">{m.answer_options_label()}</h3>
        <div class="space-y-3 mb-4">
            {#each $surveyAnswers as answer, i (answer.id)}
                <div class="flex items-center gap-2 p-2 bg-gray-600 rounded">
                    <input
                        type="text"
                        placeholder={m.option_text_placeholder()}
                        value={answer.text || ''}
                        oninput={(e) => updateAnswerProperty(i, 'text', e.currentTarget.value)}
                        class="flex-grow p-2 bg-gray-500 border border-gray-400 rounded"
                    />
                    <button
                        onclick={() => removeAnswer(answer.id)}
                        aria-label={m.remove_answer_label()}
                        class="p-2 text-red-400 hover:text-red-300 transition-colors text-xl"
                    >
                    <Icon src={Trash} theme='outline' class='h-5 w-5 color-gray-900'></Icon>
                </button>
                </div>
            {/each}
        </div>
        <form onsubmit={addAnswer} class="flex items-center gap-2">
            <input type="text" bind:value={newAnswerText} placeholder={m.option_text_placeholder()} required class="flex-grow p-2 bg-gray-500 border border-gray-400 rounded">
            <button type="submit" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow transition-colors">{m.add_option_button()}</button>
        </form>
    </section>

    <!-- Background Color -->
    <section>
        <label for="bgColor" class="block text-lg font-medium text-gray-200 mb-2">{m.background_color_label()}</label>
        <div class="flex items-center gap-3">
            <input type="color" id="bgColor" bind:value={$appBackgroundColor} class="w-12 h-12 rounded-full border-2 border-gray-500 cursor-pointer">
            <span class="p-2 bg-gray-600 rounded-md text-sm font-mono">{$appBackgroundColor}</span>
        </div>
    </section>

    <!-- Actions -->
    <section class="space-y-4">
        <!-- <h3 class="text-lg font-medium text-gray-200 mb-2">{m.actions_label?.() || 'Actions'}</h3> {/* Optional chaining for new key */} -->
        <div class="flex flex-wrap gap-3">
            <a href={`/results`}
               class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md shadow transition-colors text-center">
               {m.view_results_button()}
            </a>
            <button onclick={() => showConfirmClear = true}
                    class="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-md shadow transition-colors">
                    {m.clear_results_button()}
            </button>
            <button onclick={() => showConfirmResetSurvey = true}
                    class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md shadow transition-colors">
                    {m.reset_survey_button()}
            </button>
        </div>

        {#if showConfirmClear}
            <div class="mt-4 p-4 bg-gray-800 rounded-md border border-yellow-500">
                <p class="text-yellow-200 mb-3">{m.confirm_clear_results_message()}</p>
                <button onclick={confirmClearResults} class="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded mr-2">{m.yes_button()}</button>
                <button onclick={() => showConfirmClear = false} class="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded">{m.cancel_button()}</button>
            </div>
        {/if}
         {#if showConfirmResetSurvey}
            <div class="mt-4 p-4 bg-gray-800 rounded-md border border-red-500">
                <p class="text-red-200 mb-3">{m.confirm_reset_survey_message()}</p>
                <button onclick={confirmResetSurvey} class="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded mr-2">{m.yes_button()}</button>
                <button onclick={() => showConfirmResetSurvey = false} class="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded">{m.cancel_button()}</button>
            </div>
        {/if}
    </section>

    <a href={`/`}
       class="block w-full max-w-xs mx-auto mt-8 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-full shadow-md transition-colors text-center">
       {m.back_to_survey_button()}
    </a>
</div>