<script lang="ts">
    import { surveys, createNewSurvey, deleteSurvey, resetSurveyResults } from '$lib/stores';
    import { goto } from '$app/navigation';
    import { m } from "$lib/paraglide/messages.js";
    import { Icon } from '@steeze-ui/svelte-icon';
    import { PlusCircle, Trash, PlayCircle, Pencil, ArrowPath, ChartBar } from '@steeze-ui/heroicons';
    import ConfirmDialog from '$lib/components/ConfirmDialog.svelte';
    import EditSurveyDialog from '$lib/components/EditSurveyDialog.svelte';

    // State for confirmation dialogs
    let showDeleteConfirm = $state(false);
    let showResetConfirm = $state(false);
    
    // State for the EditSurveyDialog
    let showEditDialog = $state(false);
    let surveyIdToActOn: string | null = $state(null);

    $effect(() => {
        // When the edit dialog is closed (showEditDialog becomes false),
        // reset surveyIdToActOn. This is crucial for re-initializing EditSurveyDialog
        // if it's opened again, by ensuring its surveyIdToEdit prop changes (from null to an ID).
        if (!showEditDialog) {
            surveyIdToActOn = null;
        }
    });

    function initiateNewSurveyCreation() {
        const newId = createNewSurvey(); // Assumes this creates a survey with a default/empty question
        surveyIdToActOn = newId; // Set the ID for the dialog
        showEditDialog = true;   // Open the dialog
    }

    function handleSelectSurvey(id: string) {
        goto(`/survey?id=${id}`);
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
        // surveyIdToActOn will be reset by the $effect when showEditDialog is (or becomes) false.
    }

    function cancelDeleteSurvey() {
        showDeleteConfirm = false;
        // surveyIdToActOn will be reset by the $effect.
    }

    function handleEditSurvey(surveyId: string) {
        surveyIdToActOn = surveyId;
        showEditDialog = true;
    }

    function handleViewResults(surveyId: string) {
        goto(`/results?id=${surveyId}`);
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
        // surveyIdToActOn will be reset by the $effect.
    }

    function cancelResetResults() {
        showResetConfirm = false;
        // surveyIdToActOn will be reset by the $effect.
    }
</script>

<svelte:head>
    <title>{m.surveys_page_title()} | {m.app_title()}</title>
</svelte:head>

<div class="w-full max-w-3xl mx-auto p-6 sm:p-8 space-y-6">
    <div class="flex justify-between items-center">
        <h1 class="text-3xl sm:text-4xl font-bold text-gray-100">{m.surveys_page_title()}</h1>
    </div>

    <!-- List of Surveys -->
    <section>
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-gray-200">{m.existing_surveys_title()}</h2>
            <button
                onclick={initiateNewSurveyCreation}
                class="p-2 text-green-400 hover:text-green-300 transition-colors"
                title={m.create_new_survey_title()}
            >
                <Icon src={PlusCircle} class="w-6 h-6" />
            </button>
        </div>

        {#if $surveys.length === 0}
            <p class="text-gray-400 text-center py-4">{m.no_surveys_yet()}</p>
        {:else}
            <ul class="space-y-3">
                {#each $surveys as survey (survey.id)}
                    <li class="flex items-center justify-between bg-gray-700 p-4 rounded-md shadow hover:shadow-lg transition-shadow">
                        <span class="text-lg text-gray-100 truncate flex-1">
                            {survey.question || (m.new_survey_name_placeholder ? m.new_survey_name_placeholder() : '(New Survey - Edit to add question)')}
                        </span>
                        <div class="flex items-center gap-2">
                            <button
                                onclick={() => handleSelectSurvey(survey.id)}
                                class="p-2 text-green-400 hover:text-green-300 transition-colors"
                                title={m.start_survey_button_title()}
                            >
                                <Icon src={PlayCircle} class="w-6 h-6" />
                            </button>
                            <button
                                onclick={() => handleViewResults(survey.id)}
                                class="p-2 text-yellow-400 hover:text-yellow-300 transition-colors"
                                title={m.view_survey_results_title()}
                            >
                                <Icon src={ChartBar} class="w-6 h-6" />
                            </button>
                            <button
                                onclick={() => handleEditSurvey(survey.id)} 
                                class="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                                title={m.edit_survey_settings_title()} 
                            >
                                <Icon src={Pencil} class="w-6 h-6" />
                            </button>
                            <button
                                onclick={() => requestResetResults(survey.id)}
                                class="p-2 text-orange-400 hover:text-orange-300 transition-colors"
                                title={m.reset_survey_results_title()}
                            >
                                <Icon src={ArrowPath} class="w-6 h-6" />
                            </button>
                            <button
                                onclick={() => requestDeleteSurvey(survey.id)}
                                class="p-2 text-red-400 hover:text-red-300 transition-colors"
                                title={m.delete_survey_button_title()}
                            >
                                <Icon src={Trash} class="w-6 h-6" />
                            </button>
                        </div>
                    </li>
                {/each}
            </ul>
        {/if}
    </section>

    <!-- The old Create Survey Modal has been removed. -->

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

    <!-- Edit Survey Dialog -->
    <!-- Conditionally render EditSurveyDialog: only when surveyIdToActOn is set AND showEditDialog is true. -->
    <!-- This ensures the component is re-created/destroyed when not active, helping with re-initialization. -->
    {#if showEditDialog && surveyIdToActOn}
      <EditSurveyDialog bind:show={showEditDialog} surveyIdToEdit={surveyIdToActOn} />
    {/if}
</div>
