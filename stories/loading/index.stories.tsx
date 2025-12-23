import type { Meta, StoryObj } from "@storybook/react";
import { AppLoading } from ".";

const meta: Meta<typeof AppLoading> = {
  component: AppLoading,
};

export default meta;

type Story = StoryObj<typeof AppLoading>;

export const Default: Story = {};
