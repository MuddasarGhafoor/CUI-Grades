import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** False during server render and hydration, true after. Avoids flashing an empty state. */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
