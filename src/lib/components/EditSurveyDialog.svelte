<script lang="ts">
    import {
        surveys,
        updateSurveyDetails,
        type AnswerOption
    } from '$lib/stores';
    import { m } from "$lib/paraglide/messages.js";
    import { tick } from 'svelte';
    import { Icon } from '@steeze-ui/svelte-icon';
    import { Trash, PaintBrush } from '@steeze-ui/heroicons';
    import PillButton from '$lib/components/PillButton.svelte';

    // Props
    let { show = $bindable(), surveyIdToEdit } = $props<{ show: boolean, surveyIdToEdit: string | null }>();

    let currentSurvey = $derived(surveyIdToEdit ? $surveys.find(s => s.id === surveyIdToEdit) : undefined);

    let newAnswerText = $state('');
    
    // Reactive state based on currentSurvey
    let editableQuestion = $state('');
    let editableAnswers = $state<AnswerOption[]>([]);
    let editableAppBackgroundColor = $state('#282c34');
    let editablePillButtonColor = $state('#007bff');

    let dialogElement: HTMLDivElement | undefined = $state();
    const dialogTitleId = `dialog-title-${crypto.randomUUID()}`;

    $effect(() => {
        if (show && currentSurvey) {
            editableQuestion = currentSurvey.question;
            editableAnswers = JSON.parse(JSON.stringify(currentSurvey.answers)); // Deep copy for editing
            editableAppBackgroundColor = currentSurvey.appearance.appBackgroundColor;
            editablePillButtonColor = currentSurvey.appearance.pillButtonColor;
            newAnswerText = '';

            // Focus the dialog when it becomes visible
            tick().then(() => {
                dialogElement?.focus();
            });
        }
    });

    function addAnswer() {
        if (!newAnswerText.trim() || !currentSurvey || !surveyIdToEdit) return;
        const newAnswer: AnswerOption = {
            id: crypto.randomUUID(),
            text: newAnswerText.trim(),
        };
        editableAnswers = [...editableAnswers, newAnswer];
        newAnswerText = '';
    }

    function removeAnswer(idToRemove: string) {
        if (!currentSurvey || !surveyIdToEdit) return;
        editableAnswers = editableAnswers.filter(answer => answer.id !== idToRemove);
    }

    function updateAnswerText(index: number, newText: string) {
        if (!currentSurvey || !surveyIdToEdit) return;
        const updatedAnswers = [...editableAnswers];
        if (updatedAnswers[index]) {
            updatedAnswers[index] = { ...updatedAnswers[index], text: newText };
            editableAnswers = updatedAnswers;
        }
    }
    
    function handleSaveChanges() {
        if (!currentSurvey || !surveyIdToEdit) return;
        updateSurveyDetails(surveyIdToEdit, { 
            question: editableQuestion,
            answers: editableAnswers,
            appearance: { 
                appBackgroundColor: editableAppBackgroundColor, 
                pillButtonColor: editablePillButtonColor 
            }
        });
        handleClose();
    }

    function handleClose() {
        show = false; // This will update the bound prop in the parent
    }

    function handleDialogKeyDown(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            handleClose();
        }
    }

</script>

{#if show && currentSurvey}
<div 
    class="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    onclick={(event) => { if (event.target === event.currentTarget) handleClose(); }}
    onkeydown={handleDialogKeyDown}
    role="presentation"
>
    <div 
        bind:this={dialogElement}
        class="w-full max-w-2xl bg-gray-800 p-6 sm:p-8 rounded-lg shadow-xl space-y-6 relative overflow-y-auto max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby={dialogTitleId}
        tabindex="-1"
    >
        <button 
            onclick={handleClose} 
            title={m.cancel_button ? m.cancel_button() : 'Close'} 
            aria-label={m.cancel_button ? m.cancel_button() : 'Close dialog'}
            class="absolute top-3 right-3 text-gray-400 hover:text-gray-200 transition-colors p-1"
        >
            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' class='w-6 h-6' aria-hidden="true">
                <path stroke-linecap='round' stroke-linejoin='round' d='M6 18L18 6M6 6l12 12' />
            </svg>
        </button>
        <div class="flex justify-between items-center mb-6">
            <h2 id={dialogTitleId} class="text-2xl sm:text-3xl font-bold text-gray-100 truncate pr-2">
                {m.edit_survey_settings_title ? m.edit_survey_settings_title() : 'Edit Survey'}
            </h2>
        </div>

        <section>
            <label for="surveyQuestionDialog" class="block text-lg font-medium text-gray-200 mb-2">{m.edit_question_label ? m.edit_question_label() : "Question"}</label>
            <textarea
                id="surveyQuestionDialog"
                bind:value={editableQuestion}
                rows="2"
                placeholder={m.edit_question_label ? m.edit_question_label() : "Enter question"}
                class="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
            ></textarea>
        </section>

        <section>
            <h3 class="text-lg font-medium text-gray-200 mb-3">{m.answer_options_label ? m.answer_options_label() : "Answers"}</h3>
            <div class="space-y-3 mb-4 max-h-60 overflow-y-auto pr-2">
                {#each editableAnswers as answer, i (answer.id)}
                    <div class="flex items-center gap-2 p-2 bg-gray-700 rounded">
                        <input
                            type="text"
                            placeholder={m.option_text_placeholder ? m.option_text_placeholder() : "Answer"}
                            bind:value={answer.text}
                            class="flex-grow p-2 bg-gray-600 border border-gray-500 rounded text-gray-100"
                        />
                        <button
                            type="button"
                            onclick={() => removeAnswer(answer.id)}
                            aria-label={m.remove_answer_label ? m.remove_answer_label() : "Remove answer option"}
                            class="p-2 text-red-400 hover:text-red-300 transition-colors"
                        >
                            <Icon src={Trash} class="w-5 h-5" />
                        </button>
                    </div>
                {/each}
            </div>
            <div class="flex items-center gap-2">
                <input
                    type="text"
                    bind:value={newAnswerText}
                    placeholder={m.add_answer_placeholder ? m.add_answer_placeholder() : "New answer..."}
                    onkeypress={(e) => { if (e.key === 'Enter') addAnswer(); }}
                    class="flex-grow min-w-0 p-2 bg-gray-700 border border-gray-600 rounded text-gray-100"
                />
                <div class="flex-shrink-0">
                    <PillButton text={m.add_answer_button ? m.add_answer_button() : "Add"} onClick={addAnswer} customClass="bg-green-600 hover:bg-green-700 focus:ring-green-500 !p-2.5 text-sm" />
                </div>
            </div>
        </section>

        <section>
            <h3 class="text-lg font-medium text-gray-200 mb-3 flex items-center">
                <Icon src={PaintBrush} class="w-5 h-5 mr-2 text-indigo-400" aria-hidden="true" />
                {m.appearance_settings_title ? m.appearance_settings_title() : "Appearance"}
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label for="appBackgroundColorDialog" class="block text-sm font-medium text-gray-300 mb-1">{m.background_color_label ? m.background_color_label() : "Background"}</label>
                    <input
                        type="color"
                        id="appBackgroundColorDialog"
                        bind:value={editableAppBackgroundColor}
                        class="w-full h-10 p-1 bg-gray-700 border border-gray-600 rounded-md cursor-pointer"
                        aria-label={m.background_color_label ? m.background_color_label() : "Background color picker"}
                    />
                </div>
                <div>
                    <label for="pillButtonColorDialog" class="block text-sm font-medium text-gray-300 mb-1">{m.button_color_label ? m.button_color_label() : "Button Color"}</label>
                    <input
                        type="color"
                        id="pillButtonColorDialog"
                        bind:value={editablePillButtonColor}
                        class="w-full h-10 p-1 bg-gray-700 border border-gray-600 rounded-md cursor-pointer"
                        aria-label={m.button_color_label ? m.button_color_label() : "Button color picker"}
                    />
                </div>
            </div>
        </section>
         <div class="flex justify-end gap-3 pt-6">
            <PillButton text={m.cancel_button ? m.cancel_button() : "Cancel"} onClick={handleClose} customClass="bg-gray-600 hover:bg-gray-500 focus:ring-gray-400" />
            <PillButton text={m.confirm_button ? m.confirm_button() : "Save Changes"} onClick={handleSaveChanges} customClass="bg-blue-600 hover:bg-blue-700 focus:ring-blue-500" />
        </div>
    </div>
</div>
{/if}
