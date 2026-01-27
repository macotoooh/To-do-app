import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  useActionData,
  useFetcher,
  useLoaderData,
  useNavigate,
  useNavigation,
  useParams,
  useSearchParams,
  useSubmit,
} from "react-router";
import { ACTION_INTENT } from "~/constants/tasks";
import type { loader } from "~/routes/todos.$id";
import { UpdateTaskSchema, type UpdateTaskInput } from "~/schemas/task";
import type { ActionData } from "~/types/tasks";
import { useDisclosure } from "./common/use-disclosure";

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
  const { id } = useParams();
  const fetcher = useFetcher<{ suggestions: string[] }>();
  const { isOpen, open, close } = useDisclosure();

  const [showAISuggestions, setShowAISuggestions] = useState(true);

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

  // Indicates whether AI-generated suggestions were saved.
  // This flag comes from the URL (`ai=true`) after a successful action and is used to customize the success toast message.
  const aiCreated = params.get("ai") === "true";

  const isSubmitting = navigation.state === "submitting";

  /**
   * Called when the "Generate task ideas with AI" button is clicked.
   */
  const handleGenerateAISuggestions = async () => {
    setShowAISuggestions(true);
    await fetcher.submit(
      { title: form.watch("title") },
      { method: "post", action: `/todos/${id}/suggest-ai` },
    );
  };

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
    formData.append("status", data.status);
    if (data.content) {
      formData.append("content", data.content);
    }
    if (data.aiSuggestions) {
      for (const suggestion of data.aiSuggestions ?? []) {
        formData.append("aiSuggestions", suggestion);
      }
    }

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

  /**
   * Determines the success toast message based on the action result.
   *
   * - Differentiates between create and update actions
   * - Adds context when AI-generated suggestions were applied
   */
  const successMessage = (() => {
    if (showSuccess === "created") {
      return aiCreated
        ? "Todo created successfully. AI suggestions were added."
        : "Todo created successfully.";
    }

    if (aiCreated) {
      return "Task updated successfully. AI suggestions were added.";
    }

    return "Update completed successfully.";
  })();

  useEffect(() => {
    if (!updated && !created) return;

    setShowSuccess(created ? "created" : "updated");
    setShowAISuggestions(false);
    // Reset AI suggestions after a successful submission
    // to prevent them from affecting subsequent updates.
    form.setValue("aiSuggestions", []);

    const timer = setTimeout(async () => {
      setShowSuccess(null);
      await navigate(".", { replace: true });
    }, 4000);

    return () => clearTimeout(timer);
  }, [updated, created, navigate, form]);

  return {
    form,
    isSubmitting,
    onValid,
    showSuccess,
    actionData,
    onDelete,
    fetcher,
    isOpen,
    open,
    close,
    showAISuggestions,
    successMessage,
    handleGenerateAISuggestions,
  };
};
