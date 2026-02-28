import { rootPath } from './types';

const currentURL = window.location.href;
const currentPagePath = window.location.pathname;
const hostPath = window.location.origin;
const parts = currentPagePath.split('/').filter(Boolean);
const slashCount = (currentPagePath.match(/\//g) || []).length;

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.body.classList.add('no-dark-mode');
}

let isNavigating = false;

export function ifNavigating(way: string, url: string): void {
  if (isNavigating) return;
  isNavigating = true;

  switch (way) {
    case 'direct':
      window.location.href = url;
      break;
    case 'open':
      setTimeout(() => {
        window.open(url);
        setTimeout(() => {
          isNavigating = false;
        }, 100);
      }, 100);
      break;
    case 'jump':
      setTimeout(() => {
        window.location.href = url;
        setTimeout(() => {
          isNavigating = false;
        }, 100);
      }, 600);
      break;
  }
}

export function openLink(url: string): void {
  ifNavigating('open', url);
}

export function launchApplication(deeplink: string): void {
  window.location.assign(deeplink);
}
