import { lazy } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AppSuspense } from ".";

const Lazy = lazy(
  () =>
    new Promise<{ default: React.FC }>((resolve) =>
      setTimeout(() => {
        resolve({
          default: () => <p className="text-blue-600">lazy component</p>,
        });
      }, 3000)
    )
);

const meta: Meta<typeof AppSuspense> = {
  component: AppSuspense,
};

export default meta;

type Story = StoryObj<typeof AppSuspense>;

export const Default: Story = {
  render: () => (
    <AppSuspense>
      <Lazy />
    </AppSuspense>
  ),
};
