<script lang="ts">
    // Svelte 5 Props
    type Props = {
        text: string;
        onClick?: (event: MouseEvent) => void;
        variant?: 'primary' | 'secondary' | 'danger';
        disabled?: boolean;
        customClass?: string;
    }
    let {
        text,
        onClick,
        variant = 'primary',
        disabled = false,
        customClass = ''
    } = $props<Props>();

    const baseClasses = "w-full p-3 text-lg rounded-full font-semibold transition-colors duration-150 ease-in-out shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed";
    const variantClasses = {
        primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-400",
        secondary: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-400",
        danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-400",
    };
</script>

<button
    on:click={onClick}
    disabled={disabled}
    class="{baseClasses} {variantClasses[variant]} {customClass}"
>
    {text}
</button>