import type { Meta, StoryObj } from "@storybook/react";
import { AppToast } from ".";
import { ERROR_TOAST } from "./constants";

const meta: Meta<typeof AppToast> = {
  component: AppToast,
  args: {
    children: "Success",
  },
};

export default meta;

type Story = StoryObj<typeof AppToast>;

export const Default: Story = {};
export const Error: Story = {
  args: {
    variant: ERROR_TOAST,
    children: "Error",
  },
};
