import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { AppFilterSelect } from ".";

const meta: Meta<typeof AppFilterSelect> = {
  component: AppFilterSelect,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof AppFilterSelect>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <div className="w-full max-w-sm">
        <AppFilterSelect
          id="status-filter"
          label="Status filter"
          value={value}
          onChange={setValue}
          options={[
            { label: "All", value: "" },
            { label: "To do", value: "TODO" },
            { label: "Doing", value: "DOING" },
            { label: "Done", value: "DONE" },
          ]}
        />
      </div>
    );
  },
};

