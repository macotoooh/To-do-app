import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AppStatusLabel } from ".";
import { STATUS_VARIANT } from "./constants";

const meta: Meta<typeof AppStatusLabel> = {
  component: AppStatusLabel,
  args: {
    status: STATUS_VARIANT.todo,
  },
};

export default meta;

type Story = StoryObj<typeof AppStatusLabel>;

export const Default: Story = {};

export const Todo: Story = {
  args: {
    status: STATUS_VARIANT.todo,
  },
};

export const Doing: Story = {
  args: {
    status: STATUS_VARIANT.doing,
  },
};

export const Done: Story = {
  args: {
    status: STATUS_VARIANT.done,
  },
};
