export function showModal(modalId: string): void {
  const overlay = document.getElementById('overlay_' + modalId);
  const frame = document.getElementById(modalId);
  
  if (!overlay || !frame) return;

  overlay.style.display = 'block';
  frame.style.display = 'block';
  frame.focus();
}

export function hideModal(source: string | HTMLElement): void {
  let frameId: string | null = null;

  if (source instanceof HTMLElement) {
    let currentElement: Element | null = source.parentElement;
    while (currentElement) {
      if (currentElement.tagName?.toLowerCase() === 'modal_area') {
        frameId = currentElement.id;
        break;
      }
      currentElement = currentElement.parentElement;
    }

    if (!frameId) return;
  } else if (typeof source === 'string') {
    frameId = source;
  } else {
    return;
  }

  const overlay = document.getElementById('overlay_' + frameId);
  const frame = document.getElementById(frameId);

  if (!overlay || !frame) return;

  overlay.style.display = 'none';
  frame.style.display = 'none';
}
