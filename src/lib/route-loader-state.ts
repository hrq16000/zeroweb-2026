/** Initial SSR content is already present; the full-screen loader is only for later client navigations. */
export function shouldShowRouteLoaderOverlay(isLoading: boolean, initialLoadComplete: boolean): boolean {
  return isLoading && initialLoadComplete;
}
