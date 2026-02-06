import type { Meta, StoryObj } from "@storybook/react";
import { AppSummaryCard } from ".";
import { SUMMARY_CARD_VARIANT } from "./constants";

const meta: Meta<typeof AppSummaryCard> = {
  component: AppSummaryCard,
  args: {
    label: "All tasks",
    value: 12,
    variant: SUMMARY_CARD_VARIANT.neutral,
  },
};

export default meta;

type Story = StoryObj<typeof AppSummaryCard>;

export const Neutral: Story = {};

export const Todo: Story = {
  args: {
    label: "To do",
    value: 5,
    variant: SUMMARY_CARD_VARIANT.todo,
  },
};

export const Doing: Story = {
  args: {
    label: "Doing",
    value: 4,
    variant: SUMMARY_CARD_VARIANT.doing,
  },
};

export const Done: Story = {
  args: {
    label: "Done",
    value: 3,
    variant: SUMMARY_CARD_VARIANT.done,
  },
};

