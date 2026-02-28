export declare class CustomRadio extends HTMLElement {
    beforeToggle: ((element: HTMLElement) => boolean) | null;
    isRadioOn: boolean;
    isRadioDisabled: boolean;
    radioGroup: string;
    constructor();
    static get observedAttributes(): string[];
    connectedCallback(): void;
    attributeChangedCallback(): void;
    render(): void;
    updateRender(): void;
    shouldAllowToggle(): boolean;
    bindEvents(): void;
    updateRadioState(isOn: boolean): void;
    getRadioValue(): string;
    restoreState(): void;
}
