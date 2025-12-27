import type { Meta, StoryObj } from "@storybook/react";
import { useForm } from "react-hook-form";
import { AppTextarea } from ".";

type FormValues = {
  content: string;
};

const meta: Meta<typeof AppTextarea<FormValues>> = {
  component: AppTextarea,
  tags: ["autodocs"],
};
export default meta;

export const Default: StoryObj<typeof AppTextarea<FormValues>> = {
  render: () => {
    const {
      control,
      formState: { errors },
    } = useForm<FormValues>({
      defaultValues: {
        content: "content",
      },
    });

    return (
      <form className="w-full max-w-md space-y-2">
        <AppTextarea<FormValues>
          name="content"
          control={control}
          label="Content"
          placeholder="Enter your content"
          errorText={errors.content?.message}
        />
      </form>
    );
  },
};

export const Error: StoryObj<typeof AppTextarea<FormValues>> = {
  render: () => {
    const { control } = useForm<FormValues>({
      defaultValues: {
        content: "Sample content",
      },
    });

    return (
      <form className="w-full max-w-md space-y-2">
        <AppTextarea<FormValues>
          name="content"
          control={control}
          label="Content"
          placeholder="Enter your content"
          errorText="Sample error message"
        />
      </form>
    );
  },
};

export const Multiline: StoryObj<typeof AppTextarea<FormValues>> = {
  render: () => {
    const { control } = useForm<FormValues>({
      defaultValues: {
        content: "Sample content",
      },
    });

    return (
      <form className="w-full max-w-md space-y-2">
        <AppTextarea
          name="content"
          control={control}
          label="Content"
          placeholder="Enter your content"
          rows={10}
        />
      </form>
    );
  },
};
