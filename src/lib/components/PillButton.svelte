<script lang="ts">
    import { pillButtonColor } from '$lib/stores';

    // Svelte 5 Props
    type Props = {
        text: string;
        onClick?: (event: MouseEvent) => void;
        disabled?: boolean;
        customClass?: string;
    };
    let {
        text,
        onClick,
        disabled = false,
        customClass = ''
    } = $props<Props>();

    const baseClasses = "w-full p-3 text-lg rounded-full font-semibold transition-colors duration-150 ease-in-out shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed";
</script>

<button
    on:click={onClick}
    disabled={disabled}
    class="{baseClasses} {customClass} text-white focus:ring-[var(--pill-bg-color)] hover:brightness-90"
    style="--pill-bg-color: {$pillButtonColor}; background-color: var(--pill-bg-color);"
>
    {text}
</button>