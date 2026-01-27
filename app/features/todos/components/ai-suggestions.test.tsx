import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { AISuggestions } from "./ai-suggestions";
import type { FetcherWithComponents } from "react-router";

const createMockFetcher = (
  overrides?: Partial<FetcherWithComponents<{ suggestions: string[] }>>,
): FetcherWithComponents<{ suggestions: string[] }> =>
  ({
    state: "idle",
    data: undefined,
    ...overrides,
  }) as FetcherWithComponents<{ suggestions: string[] }>;

describe("AISuggestions", () => {
  vi.mock("stories/checkbox", () => ({
    AppCheckbox: () => <></>,
  }));

  test("shows loading state while submitting", () => {
    const loadingFetcher = createMockFetcher({
      state: "submitting",
    });
    render(
      <AISuggestions
        control={{} as any}
        name={"aiSuggestions" as any}
        fetcher={loadingFetcher}
      />,
    );

    expect(screen.getByText("🤖 AI is thinking...")).toBeInTheDocument();
  });

  test("shows suggestions description when suggestions exist", async () => {
    const fetcherWithSuggestions = createMockFetcher({
      state: "idle",
      data: { suggestions: ["Write tests", "Refactor code"] },
    });
    render(
      <AISuggestions
        control={{} as any}
        name={"aiSuggestions" as any}
        fetcher={fetcherWithSuggestions}
      />,
    );

    expect(
      await screen.findByText(
        "Selected items will be added as new tasks when you save.",
      ),
    ).toBeInTheDocument();
  });
});
