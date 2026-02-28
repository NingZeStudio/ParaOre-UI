export declare class TextField extends HTMLElement {
    inputField: HTMLTextAreaElement | null;
    hint: HTMLDivElement | null;
    isComposing: boolean;
    constructor();
    static get observedAttributes(): string[];
    connectedCallback(): void;
    validateLength(maxLength: number | null): void;
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    updateTextField(): void;
    updateHint(): void;
    autoResize(): void;
    isValidAndFilterInput(input: string, type: string): {
        isValid: boolean;
        filtered: string;
    };
    getValue(): string;
    resetValue(): void;
    saveTextFieldValue(): void;
    getTextFieldValue(): void;
}
