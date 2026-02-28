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
  ? (() => {
      const pathname = window.location.pathname;
      const distIndex = pathname.indexOf('/dist/');
      if (distIndex !== -1) {
        
        return pathname.substring(0, distIndex);
      }
      
      
      const parts = pathname.split('/').filter(Boolean);
      const depth = parts.length;
      if (depth === 0) return '';
      
      return depth > 1 ? '../'.repeat(depth - 1) + '..' : '..';
    })()
  : '';
