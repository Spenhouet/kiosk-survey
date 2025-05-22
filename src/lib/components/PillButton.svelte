<script lang="ts">
    import { surveys } from '$lib/stores';
    import { page } from '$app/state';
    import * as Button from "$lib/components/ui/button";
    import { cn } from "$lib/utils";

    // Define props using Svelte 5 runes
    let { children, onClick, disabled = false, customClass = '' } = $props<{ 
        children: any, 
        onClick: (event: MouseEvent) => void, 
        disabled?: boolean, 
        customClass?: string 
    }>();

    // Correctly use $derived for reactive computation
    let currentPillButtonColor = $derived(() => {
        const id = page.url.searchParams.get('id');
        if (!id) return '#007bff'; // Default color
        const surveyInstance = $surveys.find(s => s.id === id);
        return surveyInstance ? surveyInstance.appearance.pillButtonColor : '#007bff';
    });
</script>

<Button.Root
    on:click={onClick} 
    {disabled} 
    class={cn("p-3 text-lg rounded-full font-semibold shadow-md text-white hover:brightness-90 focus:ring-2 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed", customClass)}
    style="background-color: {currentPillButtonColor}; --pill-bg-color: {currentPillButtonColor}; outline: none; box-shadow: none;"
>
    {@render children()}
</Button.Root>