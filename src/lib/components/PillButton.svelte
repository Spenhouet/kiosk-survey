<script lang="ts">
    import { surveys } from '$lib/stores';
    import { page } from '$app/state'; // Import page store to get surveyId from params

    let {
        children,
        onClick,
        disabled = false,
        customClass = ''
    } = $props();

    let currentPillButtonColor = $derived.by(() => {
        const currentSurveyId = page.params.surveyId; // Get surveyId from page store
        if (!currentSurveyId) return '#007bff'; // Default color if no surveyId in route
        const currentSurvey = $surveys.find(s => s.id === currentSurveyId);
        return currentSurvey ? currentSurvey.appearance.pillButtonColor : '#007bff'; // Default if survey not found
    });

    const baseClasses = "p-3 text-lg rounded-full font-semibold transition-colors duration-150 ease-in-out shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed";
</script>

<button
    onclick={onClick} 
    disabled={disabled}
    class="{baseClasses} {customClass} text-white focus:ring-[var(--pill-bg-color)] hover:brightness-90"
    style="--pill-bg-color: {currentPillButtonColor}; background-color: var(--pill-bg-color);"
>
    {@render children()}
</button>