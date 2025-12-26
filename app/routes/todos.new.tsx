import { Controller, useForm } from "react-hook-form";

import { CreateTaskSchema, type CreateTaskInput } from "~/schemas/task";
import { TASK_STATUS } from "~/constants/tasks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "react-router";

const NewTodo = () => {
  const navigation = useNavigation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTaskInput>({
    resolver: zodResolver(CreateTaskSchema),
    defaultValues: {
      title: "",
      content: "",
      status: TASK_STATUS.TODO,
    },
  });

  const isSubmitting = navigation.state === "submitting";

  const onValid = async (data: CreateTaskInput) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("status", data.status);

    await fetch("/todos", {
      method: "POST",
      body: formData,
    });
  };

  return (
    <form onSubmit={handleSubmit(onValid)} className="space-y-4">
      <div>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              placeholder="Title"
              className="w-full p-2 border"
            />
          )}
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}
      </div>

      <div>
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              placeholder="Content"
              className="w-full p-2 border"
            />
          )}
        />
        {errors.content && (
          <p className="text-red-500 text-sm">{errors.content.message}</p>
        )}
      </div>

      <div>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <select {...field} className="p-2 border">
              <option value={TASK_STATUS.TODO}>To do</option>
              <option value={TASK_STATUS.DOING}>Doing</option>
              <option value={TASK_STATUS.DONE}>Done</option>
            </select>
          )}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 bg-green-500 text-white disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : "Save"}
      </button>
    </form>
  );
};

export default NewTodo;
