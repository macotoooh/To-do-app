import type { Meta, StoryObj } from "@storybook/react";
import { useForm } from "react-hook-form";
import { AppInput } from ".";

type FormValues = {
  title: string;
};

const meta: Meta<typeof AppInput<FormValues>> = {
  component: AppInput,
  tags: ["autodocs"],
};
export default meta;

export const Default: StoryObj<typeof AppInput<FormValues>> = {
  render: () => {
    const {
      control,
      formState: { errors },
    } = useForm<FormValues>({
      defaultValues: {
        title: "",
      },
    });

    return (
      <form className="w-full max-w-md space-y-2">
        <AppInput<FormValues>
          name="title"
          control={control}
          label="タイトル"
          placeholder="タイトルを入力してください"
          errorText={errors.title?.message}
        />
      </form>
    );
  },
};
