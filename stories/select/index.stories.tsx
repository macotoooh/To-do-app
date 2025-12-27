import type { Meta, StoryObj } from "@storybook/react";
import { useForm } from "react-hook-form";
import { AppSelect } from ".";
import { TASK_STATUS } from "~/constants/tasks";

type FormValues = {
  status: string;
};

const meta: Meta<typeof AppSelect> = {
  component: AppSelect,
  tags: ["autodocs"],
};
export default meta;

const options = [
  { label: "To do", value: TASK_STATUS.TODO },
  { label: "Doing", value: TASK_STATUS.DOING },
  { label: "Done", value: TASK_STATUS.DONE },
];

export const Default: StoryObj<typeof AppSelect> = {
  render: () => {
    const {
      control,
      formState: { errors },
    } = useForm<FormValues>({
      defaultValues: {
        status: "",
      },
    });

    return (
      <form className="space-y-4 w-full max-w-sm">
        <AppSelect
          name="status"
          control={control}
          label="Task Status"
          placeholder="Select status"
          options={options}
          errorText={errors.status?.message}
        />
      </form>
    );
  },
};

export const Todo: StoryObj<typeof AppSelect> = {
  render: () => {
    const { control } = useForm<FormValues>({
      defaultValues: {
        status: "",
      },
    });

    return (
      <form className="space-y-4 w-full max-w-sm">
        <AppSelect
          name="status"
          control={control}
          label="Task Status"
          placeholder="Select status"
          options={options}
          status={TASK_STATUS.TODO}
        />
      </form>
    );
  },
};

export const Doing: StoryObj<typeof AppSelect> = {
  render: () => {
    const { control } = useForm<FormValues>({
      defaultValues: {
        status: "",
      },
    });

    return (
      <form className="space-y-4 w-full max-w-sm">
        <AppSelect
          name="status"
          control={control}
          label="Task Status"
          placeholder="Select status"
          options={options}
          status={TASK_STATUS.DOING}
        />
      </form>
    );
  },
};

export const Done: StoryObj<typeof AppSelect> = {
  render: () => {
    const { control } = useForm<FormValues>({
      defaultValues: {
        status: "",
      },
    });

    return (
      <form className="space-y-4 w-full max-w-sm">
        <AppSelect
          name="status"
          control={control}
          label="Task Status"
          placeholder="Select status"
          options={options}
          status={TASK_STATUS.DONE}
        />
      </form>
    );
  },
};

export const Error: StoryObj<typeof AppSelect> = {
  render: () => {
    const { control } = useForm<FormValues>({
      defaultValues: {
        status: "",
      },
    });

    return (
      <form className="space-y-4 w-full max-w-sm">
        <AppSelect
          name="status"
          control={control}
          label="Task Status"
          placeholder="Select status"
          options={options}
          errorText="Error message"
        />
      </form>
    );
  },
};
