import type { Meta, StoryObj } from "@storybook/react";
import { AppStatusLabel } from ".";
import { TASK_STATUS } from "~/constants/tasks";

const meta: Meta<typeof AppStatusLabel> = {
  component: AppStatusLabel,
  args: {
    status: TASK_STATUS.TODO,
  },
};

export default meta;

type Story = StoryObj<typeof AppStatusLabel>;

export const Default: Story = {};

export const Todo: Story = {
  args: {
    status: TASK_STATUS.TODO,
  },
};

export const Doing: Story = {
  args: {
    status: TASK_STATUS.DOING,
  },
};

export const Done: Story = {
  args: {
    status: TASK_STATUS.DONE,
  },
};
