export declare class CustomSwitch extends HTMLElement {
    beforeToggle: ((element: HTMLElement) => boolean) | null;
    isSwitchOn: boolean;
    isSwitchDisabled: boolean;
    startX: number;
    isDragging: boolean;
    constructor();
    static get observedAttributes(): string[];
    attributeChangedCallback(): void;
    render(): void;
    updateRender(): void;
    shouldAllowToggle(): boolean;
    bindEvents(): void;
    updateSwitchState(isOn: boolean): void;
    getSwitchValue(): string;
}
