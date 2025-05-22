<script lang="ts">
    import {
        surveys,
        updateSurveyDetails,
        type AnswerOption
    } from '$lib/stores';
    import { m } from "$lib/paraglide/messages.js";
    import { Trash, Paintbrush, Signpost, MessageCircleQuestion } from '@lucide/svelte';
    import * as Dialog from "$lib/components/ui/dialog";
    import * as Button from "$lib/components/ui/button";
    import * as Input from "$lib/components/ui/input";
    import * as Label from "$lib/components/ui/label";
    import * as Textarea from "$lib/components/ui/textarea";

    // Props
    let { show = $bindable(), surveyIdToEdit } = $props<{ show: boolean, surveyIdToEdit: string | null }>();

    let currentSurvey = $derived(surveyIdToEdit ? $surveys.find(s => s.id === surveyIdToEdit) : undefined);

    let newAnswerText = $state('');
    
    let editableQuestion = $state('');
    let editableAnswers = $state<AnswerOption[]>([]);
    let editableAppBackgroundColor = $state('#eed7f9');
    let editableButtonColor = $state('#767cf9');

    $effect(() => {
        if (show && currentSurvey) {
            editableQuestion = currentSurvey.question;
            editableAnswers = JSON.parse(JSON.stringify(currentSurvey.answers));
            editableAppBackgroundColor = currentSurvey.appearance.appBackgroundColor;
            editableButtonColor = currentSurvey.appearance.buttonColor;
            newAnswerText = '';
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
    
    function handleSaveChanges() {
        if (!currentSurvey || !surveyIdToEdit) return;
        updateSurveyDetails(surveyIdToEdit, { 
            question: editableQuestion,
            answers: editableAnswers,
            appearance: { 
                appBackgroundColor: editableAppBackgroundColor, 
                buttonColor: editableButtonColor 
            }
        });
        handleClose();
    }

    function handleClose() {
        show = false;
    }

</script>

{#if currentSurvey} 
<Dialog.Root bind:open={show}>
    <Dialog.Content class="sm:max-w-2xl max-h-[calc(100vh-8rem)] m-4 flex flex-col">
        <Dialog.Header class="flex-shrink-0 p-1">
            <Dialog.Title class="truncate">{m.edit_survey_settings_title()}</Dialog.Title>
        </Dialog.Header>
        
        <div class="grid gap-6 px-1 py-4 overflow-y-auto flex-1">
            <section>
                <Label.Root for="surveyQuestionDialog" class="text-md">
                    <MessageCircleQuestion class="w-5 h-5 mr-2 text-primary" aria-hidden="true" />
                    {m.edit_question_label()}
                </Label.Root>
                <Textarea.Root
                    id="surveyQuestionDialog"
                    bind:value={editableQuestion}
                    placeholder={m.edit_question_label()}
                    class="mt-2"
                    rows={2}
                />
            </section>

            <section>
                <h3 class="text-md font-medium mb-3 flex items-center">
                    <Signpost class="w-5 h-5 mr-2 text-primary" aria-hidden="true" />
                    {m.answer_options_label()}
                </h3>
                <div class="space-y-3 mb-4 max-h-60">
                    {#each editableAnswers as answer, i (answer.id)}
                        <div class="flex items-center gap-2 bg-muted/50 dark:bg-muted/20 rounded">
                            <Input.Root
                                type="text"
                                placeholder={m.option_text_placeholder()}
                                bind:value={answer.text} 
                                class="grow"
                            />
                            <Button.Root
                                type="button"
                                variant="ghost"
                                size="icon"
                                onclick={() => removeAnswer(answer.id)}
                                aria-label={m.remove_answer_label()}
                            >
                                <Trash class="w-4 h-4 text-destructive" />
                            </Button.Root>
                        </div>
                    {/each}
                </div>
                <div class="flex items-center gap-2">
                    <Input.Root
                        id="newAnswerInput"
                        type="text"
                        bind:value={newAnswerText}
                        placeholder={m.add_answer_placeholder()}
                        onkeypress={(e) => { 
                            if (e.key === 'Enter') { 
                                e.preventDefault();
                                addAnswer(); 
                            } 
                        }}
                        class="grow min-w-0"
                    />
                    <Button.Root onclick={addAnswer} variant="secondary" class="shrink-0">{m.add_answer_button()}</Button.Root>
                </div>
            </section>

            <section>
                <h3 class="text-md font-medium mb-3 flex items-center">
                    <Paintbrush class="w-5 h-5 mr-2 text-primary" aria-hidden="true" />
                    {m.appearance_settings_title()}
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <Label.Root for="appBackgroundColorDialog" class="text-sm">{m.background_color_label()}</Label.Root>
                        <Input.Root
                            type="color"
                            id="appBackgroundColorDialog"
                            bind:value={editableAppBackgroundColor}
                            class="mt-1 w-full h-10"
                        />
                    </div>
                    <div>
                        <Label.Root for="buttonColorDialog" class="text-sm">{m.button_color_label()}</Label.Root>
                        <Input.Root
                            type="color"
                            id="buttonColorDialog"
                            bind:value={editableButtonColor}
                            class="mt-1 w-full h-10"
                        />
                    </div>
                </div>
            </section>
        </div>
        <Dialog.Footer class="sm:justify-end flex-shrink-0">
            <Button.Root variant="outline" onclick={handleClose}>{m.cancel_button()}</Button.Root>
            <Button.Root onclick={handleSaveChanges}>{m.save_changes_button()}</Button.Root>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>
{/if}
