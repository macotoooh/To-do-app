import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AppModal } from ".";
import { AppButton } from "stories/button";
import { BUTTON_VARIANT } from "stories/button/constants";

const meta: Meta<typeof AppModal> = {
  component: AppModal,
  args: {
    title: "Delete this item?",
    confirmLabel: "delete",
  },
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof AppModal>;

export const Default: Story = {};

export const WithLongTitle: Story = {
  args: {
    title:
      "Delete this item? Delete this item? Delete this item? Delete this item? Delete this item?",
  },
};

export const WithCustomColors: Story = {
  args: {
    confirmLabel: "delete",
    cancelLabel: "close",
    confirmColor: BUTTON_VARIANT.primary,
    cancelColor: BUTTON_VARIANT.new,
    onConfirm: () => {},
    onCancel: () => {},
  },
};

export const WithState: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div>
        <AppButton color={BUTTON_VARIANT.new} onClick={() => setIsOpen(true)}>
          open modal
        </AppButton>
        {isOpen && (
          <AppModal
            title="Delete this item?"
            confirmLabel="delete"
            cancelLabel="close"
            confirmColor={BUTTON_VARIANT.danger}
            cancelColor={BUTTON_VARIANT.neutral}
            onConfirm={() => {
              alert("Confirmed!");
              setIsOpen(false);
            }}
            onCancel={() => setIsOpen(false)}
          />
        )}
      </div>
    );
  },
};
