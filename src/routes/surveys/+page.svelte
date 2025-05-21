\
<script lang="ts">
    import { surveys, activeSurveyId, createNewSurvey, deleteSurvey, setActiveSurvey } from '$lib/stores';
    import { goto } from '$app/navigation';
    import { m } from '$lib/paraglide/messages';
    import PillButton from '$lib/components/PillButton.svelte';
    import { Icon } from '@steeze-ui/svelte-icon';
    import { PlusCircle, Trash, PlayCircle, Cog6Tooth } from '@steeze-ui/heroicons';

    let newSurveyName = $state('');

    function handleCreateSurvey() {
        if (!newSurveyName.trim()) {
            alert(m.survey_name_required());
            return;
        }
        const newId = createNewSurvey(newSurveyName.trim());
        newSurveyName = '';
        // Optionally navigate to the settings of the new survey
        // goto(`/settings?surveyId=${newId}`); 
    }

    function handleSelectSurvey(surveyId: string) {
        setActiveSurvey(surveyId);
        goto('/'); // Navigate to the main survey page
    }

    function handleDeleteSurvey(surveyId: string, surveyName: string) {
        if (confirm(m.confirm_delete_survey_message({ name: surveyName }))) {
            deleteSurvey(surveyId);
        }
    }

    function goToSettings(surveyId: string) {
        setActiveSurvey(surveyId); // Ensure this survey is active when going to its settings
        goto('/settings'); // Navigate to the settings page for this survey
    }
</script>

<svelte:head>
    <title>{m.surveys_page_title()} | {m.app_title()}</title>
</svelte:head>

<div class="w-full max-w-3xl mx-auto bg-gray-800 p-6 sm:p-8 rounded-lg shadow-xl space-y-6">
    <h1 class="text-3xl sm:text-4xl font-bold text-center text-gray-100 mb-8">{m.surveys_page_title()}</h1>

    <!-- Create New Survey -->
    <section class="bg-gray-700 p-4 rounded-md">
        <h2 class="text-xl font-semibold text-gray-200 mb-3">{m.create_new_survey_title()}</h2>
        <div class="flex gap-3">
            <input
                type="text"
                bind:value={newSurveyName}
                placeholder={m.new_survey_name_placeholder()}
                class="flex-grow p-3 bg-gray-600 border border-gray-500 rounded-md text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <PillButton onClick={handleCreateSurvey} customClass="bg-green-600 hover:bg-green-700 focus:ring-green-500">
                <Icon src={PlusCircle} class="w-5 h-5 mr-2" />
                {m.create_button()}
            </PillButton>
        </div>
    </section>

    <!-- List of Surveys -->
    <section>
        <h2 class="text-xl font-semibold text-gray-200 mb-4">{m.existing_surveys_title()}</h2>
        {#if $surveys.length === 0}
            <p class="text-gray-400 text-center py-4">{m.no_surveys_yet()}</p>
        {:else}
            <ul class="space-y-3">
                {#each $surveys as survey (survey.id)}
                    <li class="flex items-center justify-between bg-gray-700 p-4 rounded-md shadow hover:shadow-lg transition-shadow">
                        <span class="text-lg text-gray-100 truncate flex-1 {$activeSurveyId === survey.id ? 'font-bold text-indigo-400' : ''}">
                            {survey.name}
                        </span>
                        <div class="flex items-center gap-2">
                             <button
                                on:click={() => handleSelectSurvey(survey.id)}
                                class="p-2 text-green-400 hover:text-green-300 transition-colors"
                                title={m.start_survey_button_title()}
                            >
                                <Icon src={PlayCircle} class="w-6 h-6" />
                            </button>
                            <button
                                on:click={() => goToSettings(survey.id)}
                                class="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                                title={m.edit_survey_settings_title()}
                            >
                                <Icon src={Cog6Tooth} class="w-6 h-6" />
                            </button>
                            <button
                                on:click={() => handleDeleteSurvey(survey.id, survey.name)}
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
</div>
