/**
 * Full-screen centered loading spinner
 *
 * @returns JSX.Element
 */
export const AppLoading = () => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-white z-50">
      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-300" />
      <span className="ml-2 text-blue-400 text-sm">Loading...</span>
    </div>
  );
};
