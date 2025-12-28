import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigation, useSubmit } from "react-router";
import { TASK_STATUS } from "~/constants/tasks";
import { CreateTaskSchema, type CreateTaskInput } from "~/schemas/task";

/**
 * Hook for the new todo creation page.
 *
 * Encapsulates form state, validation, and submission logic
 * for creating a new todo.
 *
 * @returns Utilities and handlers used by the new todo page
 */
export const useNewTodo = () => {
  const navigation = useNavigation();
  const submit = useSubmit();

  const form = useForm<CreateTaskInput>({
    resolver: zodResolver(CreateTaskSchema),
    defaultValues: {
      title: "",
      content: "",
      status: TASK_STATUS.TODO,
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const isSubmitting = navigation.state === "submitting";

  /**
   * Called when form validation succeeds.
   *
   * Converts validated form values into FormData
   * and submits them to the route action.
   *
   * @param data Validated task creation input
   */
  const onValid = (data: CreateTaskInput) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("status", data.status);

    submit(formData, { method: "post" });
  };

  return {
    form,
    isSubmitting,
    onValid,
  };
};
