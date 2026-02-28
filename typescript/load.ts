export function hideMask(): void {
  const loadingMask = document.getElementById('loading_mask');
  if (!loadingMask) return;

  setTimeout(() => {
    loadingMask.style.opacity = '0';
    setTimeout(() => {
      loadingMask.style.display = 'none';
    }, 800);
  }, 1200);
}

let count = 6;
const secondInterval = setInterval(() => {
  count--;
  if (count <= 0) {
    clearInterval(secondInterval);
    hideMask();
  }
}, 1000);

document.addEventListener('DOMContentLoaded', () => {
  hideMask();
});
