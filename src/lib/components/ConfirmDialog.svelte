<script lang="ts">
    import * as m from "$lib/paraglide/messages";
    import * as Dialog from "$lib/components/ui/dialog";
    import * as Button from "$lib/components/ui/button";

    let { 
        show = $bindable(false), 
        title = '', 
        message = '', 
        onConfirm = () => {},
        onCancel = () => {}
    } = $props<{
        show?: boolean,
        title?: string,
        message?: string,
        onConfirm?: () => void,
        onCancel?: () => void
    }>();

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
</script>

<Dialog.Root bind:open={show}>
    <Dialog.Content class="sm:max-w-[425px]">
        <Dialog.Header>
            <Dialog.Title>{title}</Dialog.Title>
            {#if message}
                <Dialog.Description>{message}</Dialog.Description>
            {/if}
        </Dialog.Header>
        <Dialog.Footer class="sm:justify-end space-x-2">
            <Button.Root variant="outline" on:click={handleCancel}>
                {m.cancel_button()}
            </Button.Root>
            <Button.Root variant="destructive" on:click={handleConfirm}>
                {m.confirm_button()}
            </Button.Root>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>
