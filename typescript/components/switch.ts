import { rootPath } from '../types';

export class CustomSwitch extends HTMLElement {
  beforeToggle: ((element: HTMLElement) => boolean) | null = null;
  isSwitchOn: boolean = false;
  isSwitchDisabled: boolean = false;
  startX: number = 0;
  isDragging: boolean = false;

  constructor() {
    super();
    this.render();
  }

  static get observedAttributes(): string[] {
    return ['active', 'status'];
  }

  attributeChangedCallback(): void {
    this.updateRender();
    setTimeout(() => window.updateFocusableElements?.(), 10);
  }

  render(): void {
    const status = this.getAttribute('status') || 'disabled';
    this.isSwitchDisabled = status !== 'enabled';
    this.isSwitchOn = this.getSwitchValue() === 'on';

    this.innerHTML = `
      <div class="switch_content">
        <div class="switch ${this.isSwitchOn ? 'on' : 'off'} ${this.isSwitchDisabled ? 'disabled_switch' : 'normal_switch'}">
          <div class="switch_style left"><img alt="" src="${rootPath}/images/switch_on.png"/></div>
          <div class="switch_style right"><img alt="" src="${rootPath}/images/switch_off.png"/></div>
          <div class="switch_slider can_click"></div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  updateRender(): void {
    this.isSwitchOn = this.getSwitchValue() === 'on';
    this.isSwitchDisabled = this.getAttribute('status') !== 'enabled';

    const switchElement = this.querySelector('.switch');
    if (switchElement) {
      switchElement.classList.toggle('on', this.isSwitchOn);
      switchElement.classList.toggle('off', !this.isSwitchOn);
      switchElement.classList.toggle('disabled_switch', this.isSwitchDisabled);
      switchElement.classList.toggle('normal_switch', !this.isSwitchDisabled);
    }
  }

  shouldAllowToggle(): boolean {
    if (typeof this.beforeToggle === 'function') {
      const allowed = this.beforeToggle(this);
      if (!allowed) {
        this.dispatchEvent(new CustomEvent('switch-toggle-blocked', {
          bubbles: true,
          detail: { switchId: this.id }
        }));
        return false;
      }
    }
    return true;
  }

  bindEvents(): void {
    const switchElement = this.querySelector('.switch');
    const switchSlider = this.querySelector('.switch_slider');

    if (!this.isSwitchDisabled && switchElement && switchSlider) {
      const handlePointerDown = (e: MouseEvent | TouchEvent): void => {
        this.isDragging = false;
        switchSlider.classList.add('active');
        this.startX = 'clientX' in e ? e.clientX : e.touches[0].clientX;
      };

      const handlePointerMove = (e: MouseEvent | TouchEvent): void => {
        e.preventDefault();
        const currentX = 'clientX' in e ? e.clientX : e.changedTouches[0].clientX;
        const distanceMoved = currentX - this.startX;
        this.isDragging = distanceMoved > 10 || distanceMoved < -10;
      };

      const handlePointerUp = (e: MouseEvent | TouchEvent): void => {
        if (this.isDragging) {
          const currentX = 'clientX' in e ? e.clientX : e.changedTouches[0].clientX;
          const distanceMoved = currentX - this.startX;
          const newState = distanceMoved > 10 ? true : distanceMoved < -10 ? false : this.isSwitchOn;

          if (newState !== this.isSwitchOn) {
            if (!this.shouldAllowToggle()) {
              this.isDragging = false;
              switchSlider.classList.remove('active');
              return;
            }
            this.isSwitchOn = newState;
            this.updateSwitchState(this.isSwitchOn);
          }
        }
        setTimeout(() => {
          this.isDragging = false;
          switchSlider.classList.remove('active');
        }, 0);
      };

      const handleClick = (): void => {
        if (!this.isDragging) {
          if (!this.shouldAllowToggle()) return;
          this.isSwitchOn = !this.isSwitchOn;
          this.updateSwitchState(this.isSwitchOn);
        }
      };

      const parentElement = this.parentElement?.parentElement;
      if (parentElement) {
        parentElement.addEventListener('click', handleClick);
      }
      switchElement.addEventListener('mousedown', handlePointerDown as EventListener);
      switchElement.addEventListener('touchstart', handlePointerDown as EventListener);
      switchElement.addEventListener('mousemove', handlePointerMove as EventListener);
      switchElement.addEventListener('touchmove', handlePointerMove as EventListener);
      document.addEventListener('mouseup', handlePointerUp as EventListener);
      document.addEventListener('touchend', handlePointerUp as EventListener);
    }
  }

  updateSwitchState(isOn: boolean): void {
    this.setAttribute('active', isOn ? 'on' : 'off');
    const switchElement = this.querySelector('.switch');
    const switchSlider = this.querySelector('.switch_slider');

    switchElement?.classList.toggle('on', isOn);
    switchElement?.classList.toggle('off', !isOn);

    const switchValues = JSON.parse(localStorage.getItem(`(${rootPath}/)switch_value`) || '{}');
    switchValues[this.id] = isOn ? 'on' : 'off';
    localStorage.setItem(`(${rootPath}/)switch_value`, JSON.stringify(switchValues));

    if (switchSlider) {
      if (isOn) {
        switchSlider.classList.add('switch_bounce_left');
        switchSlider.classList.remove('switch_bounce_right');
      } else {
        switchSlider.classList.add('switch_bounce_right');
        switchSlider.classList.remove('switch_bounce_left');
      }
    }

    this.updateRender();

    const switchValueChangeEvent = new CustomEvent('switch-value-change', {
      bubbles: true,
      cancelable: true
    });
    this.dispatchEvent(switchValueChangeEvent);
  }

  getSwitchValue(): string {
    const switchValues = JSON.parse(localStorage.getItem(`(${rootPath}/)switch_value`) || '{}');
    if (this.id in switchValues) {
      return switchValues[this.id];
    }
    return this.getAttribute('active') || 'off';
  }
}

customElements.define('custom-switch', CustomSwitch);
