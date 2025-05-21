<script lang="ts">
    import { fly } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import { tick } from 'svelte';
    import * as m from "$lib/paraglide/messages"; // Import messages
    import PillButton from './PillButton.svelte';

    let {
        show = $bindable(false),
        title = '',
        message = '',
        onConfirm = () => {},
        onCancel = () => {}
    } = $props();

    let dialogElement: HTMLDivElement | undefined = $state();

    function handleConfirm() {
        onConfirm();
        show = false;
    }

    function handleCancel() {
        if (onCancel) {
            onCancel();
        }
        show = false;
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            handleCancel();
        } else if (event.key === 'Enter' || event.key === ' ') {
            // Check if the event target is the backdrop div itself
            if (event.currentTarget === document.activeElement) {
                handleCancel();
                event.preventDefault(); // Prevent default spacebar (scroll) or enter behavior
            }
        }
    }

    $effect(() => {
        if (show) {
            tick().then(() => {
                // Focus the dialog itself or the first focusable element (e.g., confirm button)
                // For simplicity, focusing the dialog container which has tabindex="-1"
                dialogElement?.focus();
            });
        }
    });
</script>

{#if show}
    <div
        class="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-[100]"
        onclick={handleCancel} 
        onkeydown={handleKeydown} 
        role="presentation" 
        tabindex="-1" 
        transition:fly={{ y: -50, duration: 300, easing: quintOut }}
    >
        <div
            bind:this={dialogElement}
            class="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-xl max-w-md w-full text-neutral-900 dark:text-neutral-100"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-message" 
            tabindex="-1" 
        >
            <h2 id="confirm-dialog-title" class="text-xl font-semibold mb-4">{title}</h2>
            <p id="confirm-dialog-message" class="mb-6">{message}</p> 
            <div class="flex justify-end space-x-3">
                <PillButton
                    onClick={handleCancel}
                    customClass="px-4 py-2 rounded text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-opacity-50"
                >
                    {m.cancel_button()}
                </PillButton>
                <PillButton
                    onClick={handleConfirm}
                    customClass="px-4 py-2 rounded text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                >
                    {m.confirm_button()}
                </PillButton>
            </div>
        </div>
    </div>
{/if}
