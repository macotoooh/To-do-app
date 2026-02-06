import type { Control, FieldValues, Path } from "react-hook-form";
import { type FetcherWithComponents } from "react-router";
import { AppCheckbox } from "stories/checkbox";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  fetcher: FetcherWithComponents<{
    suggestions: string[];
  }>;
};

/**
 * Displays a list of AI-generated task suggestions.
 *
 * @param control - The control object from useForm().
 * @param name - The field name used by React Hook Form.
 * @param fetcher - Fetcher from `useFetcher` that supplies AI suggestion data and loading state
 */
export const AISuggestions = <T extends FieldValues>({
  control,
  name,
  fetcher,
}: Props<T>) => {
  const suggestions = fetcher.data?.suggestions ?? [];
  const options = suggestions.map((sg) => ({
    label: sg,
    value: sg,
  }));

  const isLoading = fetcher.state === "submitting";
  const hasSuggestions = fetcher.state === "idle" && suggestions.length > 0;
  const showEmptyState =
    fetcher.state === "idle" && !!fetcher.data && suggestions.length === 0;

  return (
    <>
      {isLoading && (
        <div className="my-2 flex items-center gap-2 rounded-md bg-surface-bg p-3 text-sm text-gray-500 animate-pulse">
          <span>🤖 AI is thinking...</span>
        </div>
      )}

      {hasSuggestions && (
        <section className="mt-6 rounded-md border border-gray-200 bg-card-bg p-4 animate-fade-in">
          <h2 className="mb-1 text-sm font-bold">AI suggestions</h2>
          <p className="mb-3 text-xs text-gray-500">
            Selected items will be added as new tasks when you save.
          </p>
          <AppCheckbox name={name} control={control} options={options} />
        </section>
      )}

      {showEmptyState && (
        <p className="mt-3 text-sm text-gray-500">
          No suggestions found. Try a more specific title.
        </p>
      )}
    </>
  );
};
