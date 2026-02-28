export declare class CustomCheckbox extends HTMLElement {
    beforeToggle: ((element: HTMLElement) => boolean) | null;
    isCheckboxOn: boolean;
    isCheckboxDisabled: boolean;
    constructor();
    static get observedAttributes(): string[];
    connectedCallback(): void;
    attributeChangedCallback(): void;
    render(): void;
    updateRender(): void;
    shouldAllowToggle(): boolean;
    bindEvents(): void;
    updateCheckboxState(isOn: boolean): void;
    getCheckboxValue(): string;
    restoreState(): void;
}
