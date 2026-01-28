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
  const options =
    fetcher.data?.suggestions.map((sg) => ({
      label: sg,
      value: sg,
    })) ?? [];

  const isLoading = fetcher.state === "submitting";
  const hasSuggestions = fetcher.state === "idle" && fetcher.data?.suggestions;

  return (
    <>
      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-2 animate-pulse">
          <span>🤖 AI is thinking...</span>
        </div>
      )}

      {hasSuggestions && (
        <section className="mt-6 pt-4 border-t border-gray-100 animate-fade-in">
          <p className="text-xs text-gray-500 mb-3">
            Selected items will be added as new tasks when you save.
          </p>
          <AppCheckbox name={name} control={control} options={options} />
        </section>
      )}
    </>
  );
};
