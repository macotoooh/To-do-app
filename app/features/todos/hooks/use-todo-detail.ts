import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
  useSearchParams,
  useSubmit,
} from "react-router";
import { ACTION_INTENT } from "~/constants/tasks";
import type { loader } from "~/routes/todos.$id";
import { UpdateTaskSchema, type UpdateTaskInput } from "~/schemas/task";
import type { ActionData } from "~/types/tasks";

/**
 * Hook for the todo detail page.
 *
 * Encapsulates form state, validation, and submission logic
 * for updating a new todo.
 *
 * @returns Utilities and handlers used by the new todo page
 */
export const useTodoDetail = () => {
  const navigation = useNavigation();
  const submit = useSubmit();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const task = useLoaderData<typeof loader>();
  const actionData = useActionData<ActionData>();

  const form = useForm<UpdateTaskInput>({
    resolver: zodResolver(UpdateTaskSchema),
    defaultValues: {
      title: task?.title,
      content: task?.content,
      status: task?.status,
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const [showSuccess, setShowSuccess] = useState<"created" | "updated" | null>(
    null,
  );

  const updated = params.get("updated") === "true";
  const created = params.get("created") === "true";
  const isSubmitting = navigation.state === "submitting";

  /**
   * Called when form validation succeeds.
   *
   * Converts validated form values into FormData
   * and submits them to the route action.
   *
   * @param data Validated task creation input
   */
  const onValid = async (data: UpdateTaskInput) => {
    const formData = new FormData();
    formData.append("intent", ACTION_INTENT.UPDATE);
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("status", data.status);

    await submit(formData, { method: "put" });
  };

  /**
   * Handles task deletion when the Delete button in the modal is clicked.
   *
   * Sends a form submission with a special `deleteKey` to trigger deletion logic.
   */
  const onDelete = async () => {
    const formData = new FormData();
    formData.append("intent", ACTION_INTENT.DELETE);

    await submit(formData, { method: "post" });
  };

  useEffect(() => {
    if (!updated && !created) return;

    setShowSuccess(created ? "created" : "updated");

    const timer = setTimeout(async () => {
      setShowSuccess(null);
      await navigate(".", { replace: true });
    }, 4000);

    return () => clearTimeout(timer);
  }, [updated, created, navigate]);

  return {
    form,
    isSubmitting,
    onValid,
    showSuccess,
    error: actionData?.error,
    onDelete,
  };
};
