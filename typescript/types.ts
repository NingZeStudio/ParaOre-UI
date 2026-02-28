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

export const rootPath: string = typeof window !== 'undefined' 
  ? '/' + (window.location.pathname.split('/').filter(Boolean).length > 0 ? window.location.pathname.split('/').filter(Boolean)[0] : '')
  : '';
