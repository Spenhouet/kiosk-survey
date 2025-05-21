<script lang="ts">
    import { m } from '$lib/paraglide/messages';
    import { fly } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import { tick } from 'svelte';

    interface ConfirmDialogProps {
        show: boolean;
        title?: string;
        message: string;
        onConfirm: () => void;
        onCancel: () => void;
    }

    const { show, title = '', message, onConfirm, onCancel } = $props<ConfirmDialogProps>();

    let dialogElement: HTMLDivElement | undefined = $state();

    function handleConfirm() {
        onConfirm();
    }

    function handleCancel() {
        onCancel();
    }

    function handleDialogContentClick(event: MouseEvent) {
        event.stopPropagation();
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            handleCancel();
        }
    }

    $effect(() => {
        if (show && dialogElement) {
            tick().then(() => {
                dialogElement?.focus();
            });
        }
    });
</script>

{#if show}
    <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions (Backdrop click is mouse-only convenience; Escape key on dialog handles keyboard dismissal) -->
    <div
        class="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-[100]"
        onclick={handleCancel}
        transition:fly={{ y: -50, duration: 300, easing: quintOut }}
    >
        <div
            bind:this={dialogElement}
            class="bg-gray-700 p-6 rounded-lg shadow-2xl w-full max-w-md outline-none"
            onclick={handleDialogContentClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
            aria-describedby="dialog-message"
            tabindex="-1"
            onkeydown={handleKeydown}
        >
            {#if title}
                <h3 id="dialog-title" class="text-xl font-semibold text-gray-100 mb-4">{title}</h3>
            {/if}
            <p id="dialog-message" class="text-gray-200 mb-6">{message}</p>
            <div class="flex justify-end gap-3">
                <button
                    onclick={handleCancel}
                    class="px-4 py-2 text-gray-300 bg-gray-600 hover:bg-gray-500 rounded-md transition-colors"
                >
                    {m.cancel_button()}
                </button>
                <button
                    onclick={handleConfirm}
                    class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition-colors"
                >
                    {m.confirm_button()}
                </button>
            </div>
        </div>
    </div>
{/if}
