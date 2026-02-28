export declare class CustomSlider extends HTMLElement {
    isFirstRender: boolean;
    constructor();
    static get observedAttributes(): string[];
    connectedCallback(): void;
    attributeChangedCallback(): void;
    render(): void;
}
