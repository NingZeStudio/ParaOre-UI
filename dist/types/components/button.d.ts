export declare class CustomButton extends HTMLElement {
    status: string;
    icon: string;
    constructor();
    static get observedAttributes(): string[];
    attributeChangedCallback(): void;
    render(): void;
}
