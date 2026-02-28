import { rootPath } from '../types';

export class CustomCheckbox extends HTMLElement {
  beforeToggle: ((element: HTMLElement) => boolean) | null = null;

  constructor() {
    super();
    this.render();

    const checkbox = this.querySelector('input[type="checkbox"]');
    if (checkbox) {
      checkbox.addEventListener('change', () => this.toggleCheckbox());
    }
  }

  static get observedAttributes(): string[] {
    return ['status', 'active'];
  }

  connectedCallback(): void {
    this.restoreState();
  }

  attributeChangedCallback(): void {
    this.render();
    setTimeout(() => window.updateFocusableElements?.(), 10);
  }

  render(): void {
    const active = this.getAttribute('active') || 'off';
    const status = this.getAttribute('status') || 'disabled';
    const isDisabled = status !== 'enabled';
    const isOn = active === 'on';

    this.innerHTML = `
      <label class="custom-checkbox-label">
        <div class="custom-checkbox ${isOn ? 'on' : 'off'} ${isDisabled ? 'disabled' : 'enabled'}">
          <input type="checkbox" ${isOn ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
          <span class="checkmark"></span>
        </div>
      </label>
    `;

    const checkbox = this.querySelector('input[type="checkbox"]');
    if (checkbox) {
      checkbox.addEventListener('change', () => this.toggleCheckbox());
    }
  }

  shouldAllowToggle(): boolean {
    if (typeof this.beforeToggle === 'function') {
      const allowed = this.beforeToggle(this);
      if (!allowed) {
        this.dispatchEvent(new CustomEvent('checkbox-toggle-blocked', {
          bubbles: true,
          detail: { checkboxId: this.id }
        }));
        return false;
      }
    }
    return true;
  }

  toggleCheckbox(): void {
    if (this.getAttribute('status') !== 'enabled') return;
    if (!this.shouldAllowToggle()) return;

    const isChecked = this.getAttribute('active') === 'on';
    const checkboxData = JSON.parse(localStorage.getItem(`(${rootPath}/)checkbox_value`) || '{}');

    if (isChecked) {
      this.setAttribute('active', 'off');
      if (this.id === 'neverShowIn15Days') {
        localStorage.removeItem(`(${rootPath}/)neverShowIn15Days`);
      } else {
        checkboxData[this.id] = 'off';
      }
    } else {
      this.setAttribute('active', 'on');
      if (this.id === 'neverShowIn15Days') {
        localStorage.setItem(`(${rootPath}/)neverShowIn15Days`, Date.now().toString());
      } else {
        checkboxData[this.id] = 'on';
      }
    }

    localStorage.setItem(`(${rootPath}/)checkbox_value`, JSON.stringify(checkboxData));
    this.render();

    const checkboxClickEvent = new CustomEvent('checkbox-click', {
      bubbles: true,
      cancelable: true
    });
    this.dispatchEvent(checkboxClickEvent);
  }

  restoreState(): void {
    const checkboxData = JSON.parse(localStorage.getItem(`(${rootPath}/)checkbox_value`) || '{}');
    const state = checkboxData[this.id];

    if (state) {
      if (this.id === 'neverShowIn15Days') return;
      this.setAttribute('active', state);
    }
  }
}

customElements.define('custom-checkbox', CustomCheckbox);
