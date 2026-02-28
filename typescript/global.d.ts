export {};

declare global {
  interface Window {
    mainScrollContainer: HTMLElement;
    mainHandleScroll: () => void;
    updateFocusableElements: () => void;
  }
}
