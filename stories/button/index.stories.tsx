import type { Meta, StoryObj } from "@storybook/react";
import { AppButton } from ".";
import { BUTTON_VARIANT } from "./constants";

const meta: Meta<typeof AppButton> = {
  component: AppButton,
  args: {
    children: "Default",
  },
};

export default meta;

type Story = StoryObj<typeof AppButton>;

export const Default: Story = {};

export const Primary: Story = {
  args: {
    children: "save",
    color: BUTTON_VARIANT.primary,
  },
};

export const New: Story = {
  args: {
    children: "new task",
    color: BUTTON_VARIANT.new,
  },
};

export const Neutral: Story = {
  args: {
    children: "close",
    color: BUTTON_VARIANT.neutral,
  },
};

export const Danger: Story = {
  args: {
    children: "delete",
    color: BUTTON_VARIANT.danger,
  },
};
