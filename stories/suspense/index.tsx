import { Suspense, type ReactNode } from "react";
import { AppLoading } from "stories/loading";

type AppSuspenseProps = {
  children: ReactNode;
};

/**
 * AppSuspense is a wrapper component for handling asynchronous component loading with React Suspense.
 * It displays a loading UI (`AppLoading`) while the child component is being lazy-loaded.
 *
 * @component
 * @param {ReactNode} children - The component(s) to be rendered once loading is complete.
 * @returns {JSX.Element} A suspense-wrapped element with a fallback loading indicator.
 *
 * @example
 * <AppSuspense>
 *   <LazyComponent />
 * </AppSuspense>
 */

export const AppSuspense = ({ children }: AppSuspenseProps) => {
  return <Suspense fallback={<AppLoading />}>{children}</Suspense>;
};
