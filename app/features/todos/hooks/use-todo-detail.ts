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
import type { loader } from "~/routes/todos.$id";
import { UpdateTaskSchema, type UpdateTaskInput } from "~/schemas/task";

type ActionData = {
  error?: string;
};

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
      title: task.title,
      content: task.content,
      status: task.status,
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const [showSuccess, setShowSuccess] = useState<"created" | "updated" | null>(
    null
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
  const onValid = (data: UpdateTaskInput) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("status", data.status);

    submit(formData, { method: "put" });
  };

  useEffect(() => {
    if (!updated && !created) return;

    setShowSuccess(created ? "created" : "updated");

    const timer = setTimeout(() => {
      setShowSuccess(null);
      navigate(".", { replace: true });
    }, 4000);

    return () => clearTimeout(timer);
  }, [updated, created, navigate]);

  return {
    form,
    isSubmitting,
    onValid,
    showSuccess,
    actionData,
  };
};
