export class CustomCheckbox extends HTMLElement {
  beforeToggle: ((element: HTMLElement) => boolean) | null = null;
  isCheckboxOn: boolean = false;
  isCheckboxDisabled: boolean = false;

  constructor() {
    super();
    this.render();
  }

  static get observedAttributes(): string[] {
    return ['status', 'active'];
  }

  connectedCallback(): void {
    this.restoreState();
  }

  attributeChangedCallback(): void {
    this.updateRender();
    setTimeout(() => window.updateFocusableElements?.(), 10);
  }

  render(): void {
    const status = this.getAttribute('status') || 'disabled';
    this.isCheckboxDisabled = status !== 'enabled';
    this.isCheckboxOn = this.getCheckboxValue() === 'on';

    this.innerHTML = `
      <div class="switch_content">
        <div class="switch ${this.isCheckboxOn ? 'on' : 'off'} ${this.isCheckboxDisabled ? 'disabled_switch' : 'normal_switch'}">
          <div class="switch_style left"></div>
          <div class="switch_style right"></div>
          <div class="switch_slider"></div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  updateRender(): void {
    this.isCheckboxOn = this.getCheckboxValue() === 'on';
    this.isCheckboxDisabled = this.getAttribute('status') !== 'enabled';

    const switchElement = this.querySelector('.switch');
    if (switchElement) {
      switchElement.classList.toggle('on', this.isCheckboxOn);
      switchElement.classList.toggle('off', !this.isCheckboxOn);
      switchElement.classList.toggle('disabled_switch', this.isCheckboxDisabled);
      switchElement.classList.toggle('normal_switch', !this.isCheckboxDisabled);
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

  bindEvents(): void {
    const switchElement = this.querySelector('.switch');
    const switchSlider = this.querySelector('.switch_slider');

    if (!this.isCheckboxDisabled && switchElement && switchSlider) {
      const handleClick = (): void => {
        if (!this.shouldAllowToggle()) return;
        this.isCheckboxOn = !this.isCheckboxOn;
        this.updateCheckboxState(this.isCheckboxOn);
      };

      switchElement.addEventListener('click', handleClick);
    }
  }

  updateCheckboxState(isOn: boolean): void {
    this.setAttribute('active', isOn ? 'on' : 'off');
    const switchElement = this.querySelector('.switch');
    const switchSlider = this.querySelector('.switch_slider');

    switchElement?.classList.toggle('on', isOn);
    switchElement?.classList.toggle('off', !isOn);

    const checkboxValues = JSON.parse(localStorage.getItem(`checkbox_value`) || '{}');
    checkboxValues[this.id] = isOn ? 'on' : 'off';
    localStorage.setItem(`checkbox_value`, JSON.stringify(checkboxValues));

    if (switchSlider) {
      if (isOn) {
        switchSlider.classList.add('switch_bounce_left');
        switchSlider.classList.remove('switch_bounce_right');
      } else {
        switchSlider.classList.add('switch_bounce_right');
        switchSlider.classList.remove('switch_bounce_left');
      }

      setTimeout(() => {
        switchSlider.classList.remove('switch_bounce_left');
        switchSlider.classList.remove('switch_bounce_right');
      }, 350);
    }

    this.updateRender();

    const checkboxClickEvent = new CustomEvent('checkbox-click', {
      bubbles: true,
      cancelable: true
    });
    this.dispatchEvent(checkboxClickEvent);
  }

  getCheckboxValue(): string {
    const checkboxValues = JSON.parse(localStorage.getItem(`checkbox_value`) || '{}');
    if (this.id in checkboxValues) {
      return checkboxValues[this.id];
    }
    return this.getAttribute('active') || 'off';
  }

  restoreState(): void {
    const state = this.getCheckboxValue();
    this.isCheckboxOn = state === 'on';
  }
}

customElements.define('custom-checkbox', CustomCheckbox);
