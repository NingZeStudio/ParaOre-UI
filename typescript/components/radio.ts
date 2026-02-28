export class CustomRadio extends HTMLElement {
  beforeToggle: ((element: HTMLElement) => boolean) | null = null;
  isRadioOn: boolean = false;
  isRadioDisabled: boolean = false;
  radioGroup: string = '';

  constructor() {
    super();
    this.render();
  }

  static get observedAttributes(): string[] {
    return ['status', 'active', 'name'];
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
    const name = this.getAttribute('name') || '';
    this.isRadioDisabled = status !== 'enabled';
    this.isRadioOn = this.getAttribute('active') === 'on';
    this.radioGroup = name;

    this.innerHTML = `
      <div class="switch_content">
        <div class="switch ${this.isRadioOn ? 'on' : 'off'} ${this.isRadioDisabled ? 'disabled_switch' : 'normal_switch'}">
          <div class="switch_style left"></div>
          <div class="switch_style right"></div>
          <div class="switch_slider"></div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  updateRender(): void {
    this.isRadioOn = this.getAttribute('active') === 'on';
    this.isRadioDisabled = this.getAttribute('status') !== 'enabled';

    const switchElement = this.querySelector('.switch');
    if (switchElement) {
      switchElement.classList.toggle('on', this.isRadioOn);
      switchElement.classList.toggle('off', !this.isRadioOn);
      switchElement.classList.toggle('disabled_switch', this.isRadioDisabled);
      switchElement.classList.toggle('normal_switch', !this.isRadioDisabled);
    }
  }

  shouldAllowToggle(): boolean {
    if (typeof this.beforeToggle === 'function') {
      const allowed = this.beforeToggle(this);
      if (!allowed) {
        this.dispatchEvent(new CustomEvent('radio-toggle-blocked', {
          bubbles: true,
          detail: { radioId: this.id }
        }));
        return false;
      }
    }
    return true;
  }

  bindEvents(): void {
    const switchElement = this.querySelector('.switch');
    const switchSlider = this.querySelector('.switch_slider');

    if (!this.isRadioDisabled && switchElement && switchSlider) {
      const handleClick = (): void => {
        if (!this.shouldAllowToggle()) return;

        
        if (this.radioGroup) {
          const radioGroupElements = document.querySelectorAll(`custom-radio[name="${this.radioGroup}"]`);
          radioGroupElements.forEach((radio) => {
            if (radio !== this) {
              
              radio.setAttribute('active', 'off');
              radio.isRadioOn = false;
              radio.updateRender();

              
              const radioValues = JSON.parse(localStorage.getItem(`radio_value`) || '{}');
              radioValues[radio.id] = 'off';
              localStorage.setItem(`radio_value`, JSON.stringify(radioValues));
            }
          });
        }

        this.isRadioOn = true;
        this.updateRadioState(this.isRadioOn);
      };

      switchElement.addEventListener('click', handleClick);
    }
  }

  updateRadioState(isOn: boolean): void {
    this.setAttribute('active', isOn ? 'on' : 'off');
    const switchElement = this.querySelector('.switch');
    const switchSlider = this.querySelector('.switch_slider');

    switchElement?.classList.toggle('on', isOn);
    switchElement?.classList.toggle('off', !isOn);

    const radioValues = JSON.parse(localStorage.getItem(`radio_value`) || '{}');
    radioValues[this.id] = isOn ? 'on' : 'off';
    localStorage.setItem(`radio_value`, JSON.stringify(radioValues));

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

    const radioClickEvent = new CustomEvent('radio-click', {
      bubbles: true,
      cancelable: true
    });
    this.dispatchEvent(radioClickEvent);
  }

  getRadioValue(): string {
    const radioValues = JSON.parse(localStorage.getItem(`radio_value`) || '{}');
    if (this.id in radioValues) {
      return radioValues[this.id];
    }
    return this.getAttribute('active') || 'off';
  }

  restoreState(): void {
    const state = this.getRadioValue();
    this.isRadioOn = state === 'on';
    if (state === 'on') {
      this.setAttribute('active', 'on');
    } else {
      this.setAttribute('active', 'off');
    }
  }
}

customElements.define('custom-radio', CustomRadio);
