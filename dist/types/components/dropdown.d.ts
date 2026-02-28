export declare class CustomDropdown extends HTMLElement {
    margin: number;
    optionsData: string[];
    selectedValue: string | null;
    label: HTMLDivElement | null;
    arrow: HTMLDivElement | null;
    dropdownOptions: HTMLDivElement | null;
    storageKey: string;
    constructor();
    static get observedAttributes(): string[];
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    getStoredDropdownData(): Record<string, string>;
    saveDropdownData(data: Record<string, string>): void;
    toggleOptions(): void;
    selectOption(option: Element): void;
    updateLabel(): void;
    renderOptions(): void;
    handleOutsideClick(e: MouseEvent | TouchEvent): void;
}
