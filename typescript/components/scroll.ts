function throttle<T extends (...args: unknown[]) => void>(func: T, delay: number): T {
  let lastCall = 0;
  return ((...args: Parameters<T>) => {
    const now = new Date().getTime();
    if (now - lastCall < delay) return;
    lastCall = now;
    return func(...args);
  }) as T;
}

function showScroll(customScrollbar: HTMLElement): void {
  if ((customScrollbar as HTMLElement & { _scrollHideTimeout?: number })._scrollHideTimeout) {
    clearTimeout((customScrollbar as HTMLElement & { _scrollHideTimeout?: number })._scrollHideTimeout);
  }
  customScrollbar.style.opacity = '1';
  (customScrollbar as HTMLElement & { _scrollHideTimeout?: number })._scrollHideTimeout = window.setTimeout(() => {
    customScrollbar.style.opacity = '0';
  }, 3000);
}

function updateThumb(
  thumb: HTMLElement,
  container: HTMLElement,
  content: HTMLElement,
  customScrollbar: HTMLElement
): void {
  const scrollHeight = content.scrollHeight;
  const containerHeight = container.getBoundingClientRect().height;

  if (Math.round(scrollHeight) <= Math.round(containerHeight)) {
    customScrollbar.style.display = 'none';
    return;
  } else {
    customScrollbar.style.display = 'block';
  }

  const thumbHeight = Math.max((containerHeight / scrollHeight) * containerHeight, 35);
  const maxContentScroll = scrollHeight - containerHeight;
  const currentScrollTop = Math.round(container.scrollTop);
  let thumbPosition: number, thumbTrackSpace: number;

  if (content.classList.contains('main_with_tab_bar')) {
    customScrollbar.style.top = '100px';
  }

  if (customScrollbar.classList.contains('primary_custom_scrollbar')) {
    thumbTrackSpace = containerHeight - (thumbHeight + 4);
  } else {
    thumbTrackSpace = containerHeight - thumbHeight;
  }

  if (maxContentScroll > 0 && thumbTrackSpace > 0) {
    thumbPosition = (currentScrollTop / maxContentScroll) * thumbTrackSpace;
    thumbPosition = Math.max(0, Math.min(thumbPosition, thumbTrackSpace));
  } else {
    thumbPosition = 0;
  }

  thumb.style.height = `${thumbHeight}px`;
  thumb.style.top = `${thumbPosition}px`;
  customScrollbar.style.height = `${containerHeight}px`;
}

function handleScrollbarClick(
  e: MouseEvent,
  isDragging: boolean,
  customScrollbar: HTMLElement,
  thumb: HTMLElement,
  container: HTMLElement,
  content: HTMLElement
): void {
  if (isDragging || customScrollbar.classList.contains('secondary_custom_scrollbar')) return;

  const { top: scrollbarClientRectTop, height: scrollbarActualHeight } = customScrollbar.getBoundingClientRect();
  const clickClientY = e.clientY;
  const clickPositionInScrollbar = clickClientY - scrollbarClientRectTop;
  const thumbVisualHeight = thumb.offsetHeight;
  const containerVisibleHeight = container.getBoundingClientRect().height;
  const contentScrollHeight = content.scrollHeight;
  const maxContentScroll = contentScrollHeight - containerVisibleHeight;

  if (maxContentScroll <= 0) return;

  const thumbCurrentOffsetTop = thumb.offsetTop;

  if (clickPositionInScrollbar < thumbCurrentOffsetTop || clickPositionInScrollbar > (thumbCurrentOffsetTop + thumbVisualHeight)) {
    const scrollbarTrackEffectiveHeight = scrollbarActualHeight - (thumbVisualHeight + 4);

    if (scrollbarTrackEffectiveHeight <= 0) return;

    let targetThumbTop = clickPositionInScrollbar - (thumbVisualHeight / 2);
    targetThumbTop = Math.max(0, Math.min(targetThumbTop, scrollbarTrackEffectiveHeight));
    const newScrollTop = (targetThumbTop / scrollbarTrackEffectiveHeight) * maxContentScroll;
    container.scrollTop = Math.round(newScrollTop);
  }
}

function handleScroll(
  customScrollbar: HTMLElement,
  customThumb: HTMLElement,
  container: HTMLElement,
  content: HTMLElement
): void {
  if (!customScrollbar || !customThumb) return;
  showScroll(customScrollbar);
  requestAnimationFrame(() => {
    updateThumb(customThumb, container, content, customScrollbar);
  });
}

function handlePointerMove(
  e: PointerEvent | TouchEvent,
  dragState: { isDragging: boolean; startY: number; initialThumbTop: number },
  thumb: HTMLElement,
  container: HTMLElement,
  content: HTMLElement,
  customScrollbar: HTMLElement
): void {
  if (!dragState.isDragging || customScrollbar.classList.contains('secondary_custom_scrollbar')) return;

  const currentY = 'clientY' in e ? e.clientY : e.touches[0].clientY;
  const deltaY = currentY - dragState.startY;
  const containerHeight = container.getBoundingClientRect().height;
  const thumbHeight = thumb.offsetHeight;
  const maxThumbTop = containerHeight - thumbHeight;
  const newTop = Math.min(Math.max(dragState.initialThumbTop + deltaY, 0), maxThumbTop);
  const maxScrollTop = content.scrollHeight - containerHeight;

  container.scrollTo({
    top: (newTop / maxThumbTop) * maxScrollTop,
    behavior: 'instant'
  });

  updateThumb(thumb, container, content, customScrollbar);
}

function handlePointerDown(
  e: PointerEvent | TouchEvent,
  customThumb: HTMLElement,
  container: HTMLElement,
  content: HTMLElement,
  dragState: { isDragging: boolean; startY: number; initialThumbTop: number },
  customScrollbar: HTMLElement
): void {
  dragState.isDragging = true;
  dragState.startY = 'clientY' in e ? e.clientY : e.touches[0].clientY;
  dragState.initialThumbTop = customThumb.getBoundingClientRect().top - container.getBoundingClientRect().top;

  const handlePointerMoveBound = (ev: PointerEvent | TouchEvent) =>
    handlePointerMove(ev, dragState, customThumb, container, content, customScrollbar);

  document.addEventListener('pointermove', handlePointerMoveBound as EventListener);
  document.addEventListener('touchmove', handlePointerMoveBound as EventListener);

  const handlePointerUp = () => {
    dragState.isDragging = false;
    document.removeEventListener('pointermove', handlePointerMoveBound as EventListener);
    document.removeEventListener('touchmove', handlePointerMoveBound as EventListener);
  };

  document.addEventListener('pointerup', handlePointerUp, { once: true });
  document.addEventListener('touchend', handlePointerUp, { once: true });
}

function bindScrollEvents(
  container: HTMLElement,
  content: HTMLElement,
  customScrollbar: HTMLElement,
  customThumb: HTMLElement
): void {
  const dragState = { isDragging: false, startY: 0, initialThumbTop: 0 };

  const throttledUpdateAndShowScroll = throttle(() => {
    handleScroll(customScrollbar, customThumb, container, content);
  }, 1);

  const throttledShowOnly = throttle(() => {
    showScroll(customScrollbar);
  }, 100);

  customScrollbar.addEventListener('wheel', (e) => {
    const delta = e.deltaY > 0 ? 10 : -10;
    container.scrollTop += delta;
    throttledUpdateAndShowScroll();
    e.preventDefault();
  });

  document.addEventListener('mousemove', throttledShowOnly);
  document.addEventListener('touchmove', throttledShowOnly);
  container.addEventListener('scroll', throttledUpdateAndShowScroll);
  window.addEventListener('resize', throttledUpdateAndShowScroll);
  customThumb.addEventListener('pointerdown', (e) => handlePointerDown(e, customThumb, container, content, dragState, customScrollbar));
  customThumb.addEventListener('touchstart', (e) => handlePointerDown(e, customThumb, container, content, dragState, customScrollbar));
  customScrollbar.addEventListener('click', (e) => handleScrollbarClick(e, dragState.isDragging, customScrollbar, customThumb, container, content));
  window.addEventListener('load', () => setTimeout(throttledUpdateAndShowScroll, 10));
}

function initializeScrollContainers(): void {
  const containers = document.querySelectorAll('.primary_scroll_container, .secondary_scroll_container');

  containers.forEach((container) => {
    const contentElement = container.querySelector('.scroll_container, .sidebar_content') as HTMLElement;
    const scrollViewElement = contentElement?.closest('scroll-view');
    const customScrollbarElement = scrollViewElement?.querySelector('custom-scrollbar') as HTMLElement;
    const customThumbElement = customScrollbarElement?.querySelector('custom-scrollbar-thumb') as HTMLElement;

    if (contentElement && customScrollbarElement && customThumbElement) {
      bindScrollEvents(container as HTMLElement, contentElement, customScrollbarElement, customThumbElement);

      const ScrollHandlerForResize = createHandleScroll(customScrollbarElement, customThumbElement, container as HTMLElement, contentElement);
      const throttledScrollHandler = throttle(ScrollHandlerForResize, 1);
      const observer = new ResizeObserver(() => {
        throttledScrollHandler();
      });
      observer.observe(container);
      observer.observe(contentElement);
    }
  });
}

function createHandleScroll(
  customScrollbar: HTMLElement,
  customThumb: HTMLElement,
  container: HTMLElement,
  content: HTMLElement
): () => void {
  return () => {
    handleScroll(customScrollbar, customThumb, container, content);
  };
}

document.addEventListener('DOMContentLoaded', () => {
  initializeScrollContainers();
});

const mainScrollContainer = document.querySelector('.primary_scroll_container') as HTMLElement;

export function getMainHandleScroll(): () => void {
  const scrollView = document.querySelector('.scroll_container')?.closest('scroll-view');
  const scrollbar = scrollView?.querySelector('custom-scrollbar') as HTMLElement;
  const thumb = scrollView?.querySelector('custom-scrollbar-thumb') as HTMLElement;

  if (mainScrollContainer && scrollbar && thumb) {
    return throttle(createHandleScroll(scrollbar, thumb, mainScrollContainer, document.querySelector('.scroll_container') as HTMLElement), 1);
  }
  return () => {};
}

if (typeof window !== 'undefined') {
  (window as any).mainScrollContainer = mainScrollContainer;
  (window as any).mainHandleScroll = getMainHandleScroll();
}
