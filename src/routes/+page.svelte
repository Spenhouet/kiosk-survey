<script lang="ts">
    import { surveys, createNewSurvey, deleteSurvey, updateSurveyDetails, resetSurveyResults } from '$lib/stores';
    import { goto } from '$app/navigation';
    import { m } from '$lib/paraglide/messages';
    import { Icon } from '@steeze-ui/svelte-icon';
    import { PlusCircle, Trash, PlayCircle, Cog6Tooth, ArrowPath, ChartBar } from '@steeze-ui/heroicons';
    import ConfirmDialog from '$lib/components/ConfirmDialog.svelte';

    let showCreateModal = $state(false);
    let newSurveyName = $state('');

    let showDeleteConfirm = $state(false);
    let showResetConfirm = $state(false);
    let surveyIdToActOn: string | null = $state(null);
    let surveyNameToActOn: string | null = $state(null);

    function handleCreateSurvey() {
        if (!newSurveyName.trim()) {
            alert(m.survey_name_required());
            return;
        }
        const newId = createNewSurvey(); 
        updateSurveyDetails(newId, { name: newSurveyName.trim() });
        goto(`/survey/${newId}/edit`); 
        showCreateModal = false;
        newSurveyName = '';
    }

    function handleSelectSurvey(surveyId: string) {
        goto(`/survey/${surveyId}`);
    }

    function requestDeleteSurvey(surveyId: string, surveyName: string) {
        surveyIdToActOn = surveyId;
        surveyNameToActOn = surveyName;
        showDeleteConfirm = true;
    }

    function confirmDeleteSurvey() {
        if (surveyIdToActOn) {
            deleteSurvey(surveyIdToActOn);
        }
        showDeleteConfirm = false;
        surveyIdToActOn = null;
        surveyNameToActOn = null;
    }

    function cancelDeleteSurvey() {
        showDeleteConfirm = false;
        surveyIdToActOn = null;
        surveyNameToActOn = null;
    }

    function handleEditSurvey(surveyId: string) {
        goto(`/survey/${surveyId}/edit`);
    }

    function handleViewResults(surveyId: string) {
        goto(`/survey/${surveyId}/results`);
    }

    function requestResetResults(surveyId: string, surveyName: string) {
        surveyIdToActOn = surveyId;
        surveyNameToActOn = surveyName;
        showResetConfirm = true;
    }

    function confirmResetResults() {
        if (surveyIdToActOn) {
            resetSurveyResults(surveyIdToActOn);
        }
        showResetConfirm = false;
        surveyIdToActOn = null;
        surveyNameToActOn = null;
    }

    function cancelResetResults() {
        showResetConfirm = false;
        surveyIdToActOn = null;
        surveyNameToActOn = null;
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
                onclick={() => (showCreateModal = true)}
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
                            {survey.name}
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
                                <Icon src={Cog6Tooth} class="w-6 h-6" />
                            </button>
                            <button
                                onclick={() => requestResetResults(survey.id, survey.name)}
                                class="p-2 text-orange-400 hover:text-orange-300 transition-colors"
                                title={m.reset_survey_results_title()}
                            >
                                <Icon src={ArrowPath} class="w-6 h-6" />
                            </button>
                            <button
                                onclick={() => requestDeleteSurvey(survey.id, survey.name)}
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

    <!-- Create Survey Modal -->
    {#if showCreateModal}
        <div class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div class="bg-gray-700 p-6 rounded-lg shadow-xl w-full max-w-md">
                <h3 class="text-xl font-semibold text-gray-100 mb-4">{m.create_new_survey_title()}</h3>
                <input
                    type="text"
                    bind:value={newSurveyName}
                    placeholder={m.new_survey_name_placeholder()}
                    class="w-full p-3 bg-gray-600 border border-gray-500 rounded-md text-gray-100 focus:ring-indigo-500 focus:border-indigo-500 mb-4"
                />
                <div class="flex justify-end gap-3">
                    <button
                        onclick={() => { showCreateModal = false; newSurveyName = ''; }}
                        class="px-4 py-2 text-gray-300 bg-gray-600 hover:bg-gray-500 rounded-md transition-colors"
                    >
                        {m.cancel_button()}
                    </button>
                    <button
                        onclick={handleCreateSurvey}
                        class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition-colors"
                    >
                        {m.create_button()}
                    </button>
                </div>
            </div>
        </div>
    {/if}

    <!-- Delete Confirmation Modal -->
    <ConfirmDialog
        bind:show={showDeleteConfirm}
        title={m.delete_survey_title()}
        message={surveyNameToActOn ? m.confirm_delete_survey_message({ name: surveyNameToActOn }) : ''}
        onConfirm={confirmDeleteSurvey}
        onCancel={cancelDeleteSurvey}
    />

    <!-- Reset Confirmation Modal -->
    <ConfirmDialog
        bind:show={showResetConfirm}
        title={m.reset_survey_results_title()}
        message={surveyNameToActOn ? m.confirm_reset_survey_results_message({ name: surveyNameToActOn }) : ''}
        onConfirm={confirmResetResults}
        onCancel={cancelResetResults}
    />
</div>
