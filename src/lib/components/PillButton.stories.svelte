<script lang="ts">
    import type { Meta, StoryObj, Template } from '@storybook/svelte';
    import PillButton from './PillButton.svelte';
  
    const meta = {
      title: 'Components/PillButton',
      component: PillButton,
      argTypes: {
        text: { control: 'text' },
        variant: {
          control: { type: 'select' },
          options: ['primary', 'secondary', 'danger'],
        },
        disabled: { control: 'boolean' },
        onClick: { action: 'clicked' } // Storybook action logger
      },
      tags: ['autodocs'], // Enable autodocs
    } satisfies Meta<PillButton>;
  
    export default meta;
    type Story = StoryObj<typeof meta>;
  
    // Default Story
    export const Primary: Story = {
      args: {
        text: 'Primary Button',
        variant: 'primary',
      },
    };
  
    export const Secondary: Story = {
      args: {
        text: 'Secondary Button',
        variant: 'secondary',
      },
    };
  
    export const DangerDisabled: Story = {
      args: {
        text: 'Danger Disabled',
        variant: 'danger',
        disabled: true,
      },
    };
  </script>
  
  <!--
    The Storybook Svelte renderer will handle rendering the component
    based on the 'component' field in 'meta' and the 'args' in each story.
    You typically don't need a <Template let:args> ... </Template> wrapper
    for Svelte 5 / Storybook 7+ unless doing complex story rendering.
    If you have issues, you might need:
  -->
  <!--
  <Template let:args>
    <PillButton {...args} />
  </Template>
  -->
  
  <!-- For Svelte 5 and Storybook 8+, it might just be: -->
  <Story />