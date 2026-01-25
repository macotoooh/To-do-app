import type { Meta, StoryObj } from "@storybook/react";
import { useForm } from "react-hook-form";
import { AppCheckbox } from ".";

type FormValues = {
  tags: string[];
};

const meta: Meta<typeof AppCheckbox<FormValues>> = {
  component: AppCheckbox<FormValues>,
};

export default meta;
type Story = StoryObj<typeof meta>;

const options = [
  { label: "Frontend", value: "frontend" },
  { label: "Backend", value: "backend" },
  { label: "Design", value: "design" },
  { label: "Testing", value: "testing" },
];

const Template = (
  args: Omit<Parameters<typeof AppCheckbox<FormValues>>[0], "control">,
) => {
  const { control, watch } = useForm<FormValues>({
    defaultValues: {
      tags: [],
    },
  });

  const values = watch("tags");

  return (
    <div className="space-y-4 max-w-sm">
      <AppCheckbox<FormValues> {...args} name="tags" control={control} />
      <div className="text-xs text-muted-foreground">
        <p className="font-medium">Form Value:</p>
        <pre className="bg-muted p-2 rounded">
          {JSON.stringify(values, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export const Default: Story = {
  render: () =>
    Template({
      name: "tags",
      options,
    }),
};

export const Error: Story = {
  render: () =>
    Template({
      name: "tags",
      options,
      errorText: "Please select at least one option.",
    }),
};
