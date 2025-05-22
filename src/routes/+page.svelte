<script lang="ts">
    import { surveys, createNewSurvey, deleteSurvey, resetSurveyResults } from '$lib/stores';
    import { goto } from '$app/navigation';
    import { m } from "$lib/paraglide/messages.js";
    import { PlusCircle, Trash, PlayCircle, Pencil, ArrowRightCircle, ChartBar } from '@lucide/svelte';
    import ConfirmDialog from '$lib/components/ConfirmDialog.svelte';
    import EditSurveyDialog from '$lib/components/EditSurveyDialog.svelte';
    import { resolveRoute } from '$app/paths';
    import * as Button from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card";

    // State for confirmation dialogs
    let showDeleteConfirm = $state(false);
    let showResetConfirm = $state(false);
    
    // State for the EditSurveyDialog
    let showEditDialog = $state(false);
    let surveyIdToActOn: string | null = $state(null);

    $effect(() => {
        if (!showEditDialog) {
            surveyIdToActOn = null;
        }
    });

    function initiateNewSurveyCreation() {
        const newId = createNewSurvey();
        surveyIdToActOn = newId;
        showEditDialog = true;
    }

    function handleSelectSurvey(id: string) {
        goto(resolveRoute(`/survey?id=${id}`, {}));
    }

    function requestDeleteSurvey(surveyId: string) {
        surveyIdToActOn = surveyId;
        showDeleteConfirm = true;
    }

    function confirmDeleteSurvey() {
        if (surveyIdToActOn) {
            deleteSurvey(surveyIdToActOn);
        }
        showDeleteConfirm = false;
    }

    function cancelDeleteSurvey() {
        showDeleteConfirm = false;
    }

    function handleEditSurvey(surveyId: string) {
        surveyIdToActOn = surveyId;
        showEditDialog = true;
    }

    function handleViewResults(surveyId: string) {
        goto(resolveRoute(`/results?id=${surveyId}`, {}));
    }

    function requestResetResults(surveyId: string) {
        surveyIdToActOn = surveyId;
        showResetConfirm = true;
    }

    function confirmResetResults() {
        if (surveyIdToActOn) {
            resetSurveyResults(surveyIdToActOn);
        }
        showResetConfirm = false;
    }

    function cancelResetResults() {
        showResetConfirm = false;
    }
</script>

<svelte:head>
    <title>{m.surveys_page_title()} | {m.app_title()}</title>
</svelte:head>

<div class="w-full max-w-3xl mx-auto p-6 sm:p-8 space-y-6">
    <div class="flex justify-between items-center">
        <h1 class="text-3xl sm:text-4xl font-bold">{m.surveys_page_title()}</h1>
    </div>

    <!-- List of Surveys -->
    <section>
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold">{m.existing_surveys_title()}</h2>
            <Button.Root
                variant="ghost"
                size="icon"
                onclick={initiateNewSurveyCreation}
                title={m.create_new_survey_title()}
            >
                <PlusCircle class="w-6 h-6 text-green-600 dark:text-green-400" />
            </Button.Root>
        </div>

        {#if $surveys.length === 0}
            <p class="text-muted-foreground text-center py-4">{m.no_surveys_yet()}</p>
        {:else}
            <ul class="space-y-3">
                {#each $surveys as survey (survey.id)}
                    <Card.Root class="flex items-center justify-between p-4 hover:shadow-lg transition-shadow">
                        <Card.Header class="p-0 flex-1">
                            <Card.Title class="text-lg truncate">
                                {survey.question || (m.new_survey_name_placeholder ? m.new_survey_name_placeholder() : '(New Survey - Edit to add question)')}
                            </Card.Title>
                        </Card.Header>
                        <Card.Content class="p-0 flex items-center gap-1 sm:gap-2">
                            <Button.Root variant="ghost" size="icon" onclick={() => handleSelectSurvey(survey.id)} title={m.start_survey_button_title()}>
                                <PlayCircle class="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
                            </Button.Root>
                            <Button.Root variant="ghost" size="icon" onclick={() => handleViewResults(survey.id)} title={m.view_survey_results_title()}>
                                <ChartBar class="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 dark:text-yellow-400" />
                            </Button.Root>
                            <Button.Root variant="ghost" size="icon" onclick={() => handleEditSurvey(survey.id)} title={m.edit_survey_settings_title()}>
                                <Pencil class="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 dark:text-blue-400" />
                            </Button.Root>
                            <Button.Root variant="ghost" size="icon" onclick={() => requestResetResults(survey.id)} title={m.reset_survey_results_title()}>
                                <ArrowRightCircle class="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 dark:text-orange-400" />
                            </Button.Root>
                            <Button.Root variant="ghost" size="icon" onclick={() => requestDeleteSurvey(survey.id)} title={m.delete_survey_button_title()}>
                                <Trash class="w-5 h-5 sm:w-6 sm:h-6 text-red-500 dark:text-red-400" />
                            </Button.Root>
                        </Card.Content>
                    </Card.Root>
                {/each}
            </ul>
        {/if}
    </section>
</div>

<!-- Delete Confirmation Modal -->
<ConfirmDialog
    bind:show={showDeleteConfirm}
    title={m.delete_survey_title()}
    message={m.confirm_delete_survey_message_generic ? m.confirm_delete_survey_message_generic() : 'Are you sure you want to delete this survey?'}
    onConfirm={confirmDeleteSurvey}
    onCancel={cancelDeleteSurvey}
/>

<!-- Reset Confirmation Modal -->
<ConfirmDialog
    bind:show={showResetConfirm}
    title={m.reset_survey_results_title()}
    message={m.confirm_reset_survey_results_message_generic ? m.confirm_reset_survey_results_message_generic() : 'Are you sure you want to reset results for this survey?'}
    onConfirm={confirmResetResults}
    onCancel={cancelResetResults}
/>

{#if showEditDialog && surveyIdToActOn}
  <EditSurveyDialog bind:show={showEditDialog} surveyIdToEdit={surveyIdToActOn} />
{/if}