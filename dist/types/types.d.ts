export interface DragState {
    isDragging: boolean;
    startY: number;
    initialThumbTop: number;
}
export interface SliderData {
    minValue: number;
    maxValue: number;
    segments: number;
    initialValue?: number;
    step?: number;
}
export declare const rootPath: string;
