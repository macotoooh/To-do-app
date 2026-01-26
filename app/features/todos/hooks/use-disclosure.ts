import { useCallback, useState } from "react";

/**
 * A small utility hook for managing open / close state.
 *
 * Commonly used for modals, dialogs, dropdowns, etc.
 *
 * @param initial - Initial open state (default: false)
 * @returns An object containing the current state and helper functions
 *
 * @example
 * const { isOpen, open, close, toggle } = useDisclosure();
 */
export const useDisclosure = (initial = false) => {
  const [isOpen, setIsOpen] = useState(initial);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
};
