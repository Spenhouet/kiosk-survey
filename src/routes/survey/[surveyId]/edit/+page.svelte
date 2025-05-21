<script lang="ts">
    import {
        surveys,
        updateSurveyDetails,
        resetSurveyResults,
        type AnswerOption
    } from '$lib/stores';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { m } from "$lib/paraglide/messages.js";
    import { tick } from 'svelte';
    import { Icon } from '@steeze-ui/svelte-icon';
    import { Trash, ArrowPath, PaintBrush } from '@steeze-ui/heroicons';
    import PillButton from '$lib/components/PillButton.svelte';

    let surveyId = $derived($page.params.surveyId);
    let currentSurvey = $derived($surveys.find(s => s.id === surveyId));

    let newAnswerText = $state('');
    let showConfirmClear = $state(false);
    
    let currentSurveyName = $derived(currentSurvey?.name || (m.settings_page_fallback_title ? m.settings_page_fallback_title() : "Settings"));
    let currentSurveyQuestion = $derived(currentSurvey?.question || '');
    let currentSurveyAnswers = $derived(currentSurvey?.answers || []);
    let currentAppBackgroundColor = $derived(currentSurvey?.appearance.appBackgroundColor || '#282c34');
    let currentPillButtonColor = $derived(currentSurvey?.appearance.pillButtonColor || '#007bff');

    function addAnswer() {
        if (!newAnswerText.trim() || !currentSurvey) return;
        const newAnswer: AnswerOption = {
            id: crypto.randomUUID(),
            text: newAnswerText.trim(),
        };
        updateSurveyDetails(surveyId, { answers: [...currentSurveyAnswers, newAnswer] });
        newAnswerText = '';
    }

    function removeAnswer(idToRemove: string) {
        if (!currentSurvey) return;
        updateSurveyDetails(surveyId, { answers: currentSurveyAnswers.filter(answer => answer.id !== idToRemove) });
    }

    function updateAnswerText(index: number, newText: string) {
        if (!currentSurvey) return;
        const updatedAnswers = [...currentSurveyAnswers];
        if (updatedAnswers[index]) {
            updatedAnswers[index] = { ...updatedAnswers[index], text: newText };
            updateSurveyDetails(surveyId, { answers: updatedAnswers });
        }
    }
    
    function handleSurveyNameBlur(event: FocusEvent) {
        const newName = (event.currentTarget as HTMLInputElement).value;
        if (!currentSurvey) return;
        if (!newName.trim()) {
            alert(m.survey_name_required ? m.survey_name_required() : "Survey name cannot be empty.");
            (event.currentTarget as HTMLInputElement).value = currentSurveyName; 
            return;
        }
        updateSurveyDetails(surveyId, { name: newName.trim() });
    }

    function handleQuestionInput(event: Event) {
        if (!currentSurvey) return;
        updateSurveyDetails(surveyId, { question: (event.currentTarget as HTMLTextAreaElement).value });
    }

    function handleAppBackgroundColorInput(event: Event) {
        if (!currentSurvey) return;
        updateSurveyDetails(surveyId, { appearance: { ...currentSurvey.appearance, appBackgroundColor: (event.currentTarget as HTMLInputElement).value }});
    }

    function handlePillButtonColorInput(event: Event) {
        if (!currentSurvey) return;
        updateSurveyDetails(surveyId, { appearance: { ...currentSurvey.appearance, pillButtonColor: (event.currentTarget as HTMLInputElement).value }});
    }

    async function confirmClearResults() {
        if (!currentSurvey) return;
        resetSurveyResults(surveyId); 
        showConfirmClear = false;
        await tick();
        alert(m.confirm_clear_results_message ? m.confirm_clear_results_message() : "Results cleared.");
    }

</script>

<svelte:head>
    <title>{m.edit_survey_settings_title_dynamic ? m.edit_survey_settings_title_dynamic({ name: currentSurveyName }) : `Settings for ${currentSurveyName}`} | {m.app_title ? m.app_title() : "App"}</title>
</svelte:head>

{#if currentSurvey}
<div class="w-full max-w-2xl mx-auto bg-gray-700 p-6 sm:p-8 rounded-lg shadow-xl space-y-8">
    <div class="flex justify-between items-center">
        <h2 class="text-2xl sm:text-3xl font-bold text-gray-100 truncate pr-2">
            {m.edit_survey_settings_title_dynamic ? m.edit_survey_settings_title_dynamic({ name: currentSurveyName }) : `Settings for ${currentSurveyName}`}
        </h2>
        <PillButton text={m.back_to_surveys_button ? m.back_to_surveys_button() : "All Surveys"} onClick={() => goto('/')} customClass="bg-gray-600 hover:bg-gray-500 focus:ring-gray-400 text-sm !p-2.5" />
    </div>
    
    <section>
        <label for="surveyName" class="block text-lg font-medium text-gray-200 mb-2">{m.edit_survey_name_label ? m.edit_survey_name_label() : "Survey Name"}</label>
        <input
            id="surveyName"
            type="text"
            value={currentSurveyName} 
            onblur={handleSurveyNameBlur}
            placeholder={m.edit_survey_name_placeholder ? m.edit_survey_name_placeholder() : "Enter survey name"}
            class="w-full p-3 bg-gray-600 border border-gray-500 rounded-md text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
        />
    </section>

    <section>
        <label for="surveyQuestion" class="block text-lg font-medium text-gray-200 mb-2">{m.edit_question_label ? m.edit_question_label() : "Question"}</label>
        <textarea
            id="surveyQuestion"
            value={currentSurveyQuestion} 
            oninput={handleQuestionInput}
            rows="2"
            placeholder={m.edit_question_label ? m.edit_question_label() : "Enter question"}
            class="w-full p-3 bg-gray-600 border border-gray-500 rounded-md text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
        ></textarea>
    </section>

    <section>
        <h3 class="text-lg font-medium text-gray-200 mb-3">{m.answer_options_label ? m.answer_options_label() : "Answers"}</h3>
        <div class="space-y-3 mb-4">
            {#each currentSurveyAnswers as answer, i (answer.id)}
                <div class="flex items-center gap-2 p-2 bg-gray-600 rounded">
                    <input
                        type="text"
                        placeholder={m.option_text_placeholder ? m.option_text_placeholder() : "Answer"}
                        value={answer.text || ''}
                        oninput={(e) => updateAnswerText(i, (e.currentTarget as HTMLInputElement).value)}
                        class="flex-grow p-2 bg-gray-500 border border-gray-400 rounded text-gray-100"
                    />
                    <button
                        onclick={() => removeAnswer(answer.id)}
                        aria-label={m.remove_answer_label ? m.remove_answer_label() : "Remove"}
                        class="p-2 text-red-400 hover:text-red-300 transition-colors"
                    >
                        <Icon src={Trash} class="w-5 h-5" />
                    </button>
                </div>
            {/each}
        </div>
        <div class="flex gap-2">
            <input
                type="text"
                bind:value={newAnswerText}
                placeholder={m.add_answer_placeholder ? m.add_answer_placeholder() : "New answer..."}
                onkeypress={(e) => e.key === 'Enter' && addAnswer()}
                class="flex-grow p-2 bg-gray-500 border border-gray-400 rounded text-gray-100"
            />
            <PillButton text={m.add_answer_button ? m.add_answer_button() : "Add"} onClick={addAnswer} customClass="bg-green-600 hover:bg-green-700 focus:ring-green-500 !p-2.5 text-sm" />
        </div>
    </section>

    <section>
        <h3 class="text-lg font-medium text-gray-200 mb-3 flex items-center">
            <Icon src={PaintBrush} class="w-5 h-5 mr-2 text-indigo-400" />
            {m.appearance_settings_title ? m.appearance_settings_title() : "Appearance"}
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label for="appBackgroundColor" class="block text-sm font-medium text-gray-300 mb-1">{m.background_color_label ? m.background_color_label() : "Background"}</label>
                <input
                    type="color"
                    id="appBackgroundColor"
                    value={currentAppBackgroundColor}
                    oninput={handleAppBackgroundColorInput}
                    class="w-full h-10 p-1 bg-gray-600 border border-gray-500 rounded-md cursor-pointer"
                />
            </div>
            <div>
                <label for="pillButtonColor" class="block text-sm font-medium text-gray-300 mb-1">{m.button_color_label ? m.button_color_label() : "Button Color"}</label>
                <input
                    type="color"
                    id="pillButtonColor"
                    value={currentPillButtonColor}
                    oninput={handlePillButtonColorInput}
                    class="w-full h-10 p-1 bg-gray-600 border border-gray-500 rounded-md cursor-pointer"
                />
            </div>
        </div>
    </section>
</div>
{:else}
    <p class="text-xl text-gray-400 my-8 text-center">{m.loading_survey_data ? m.loading_survey_data() : "Loading survey data..."}</p>
{/if}