import { getMainHandleScroll } from './scroll';

export class TextField extends HTMLElement {
  inputField: HTMLTextAreaElement | null = null;
  hint: HTMLDivElement | null = null;
  isComposing: boolean = false;

  constructor() {
    super();
    const type = this.getAttribute('type') || 'text';
    const isSingleLine = this.getAttribute('single-line') || 'true';
    const maxLength = parseInt(this.getAttribute('max-length') || '0') || null;

    this.inputField = document.createElement('textarea');
    this.inputField.classList.add('input');
    this.inputField.rows = 1;
    this.appendChild(this.inputField);

    this.hint = document.createElement('div');
    this.hint.classList.add('hint');
    this.hint.textContent = this.getAttribute('hint') || '';
    this.appendChild(this.hint);

    if (isSingleLine === 'true') {
      this.inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
        }
      });
    }

    this.inputField.addEventListener('focus', () => {
      if (this.hint) this.hint.style.opacity = '0';
    });

    this.inputField.addEventListener('blur', () => {
      this.updateHint();
    });

    this.inputField.addEventListener('compositionstart', () => {
      this.isComposing = true;
    });

    this.inputField.addEventListener('compositionend', () => {
      this.isComposing = false;
      setTimeout(() => {
        this.validateLength(maxLength);
        const inputValue = this.inputField?.value || '';
        const { isValid, filtered } = this.isValidAndFilterInput(inputValue, type);
        if (!isValid && this.inputField) {
          this.inputField.value = filtered;

          const textfieldInvalidInputEvent = new CustomEvent('textfield-invalid-input', {
            bubbles: true,
            cancelable: true
          });
          this.dispatchEvent(textfieldInvalidInputEvent);

          return;
        }
        this.saveTextFieldValue();
      }, 0);
    });

    this.inputField.addEventListener('beforeinput', (e: InputEvent) => {
      if (!this.isComposing && e.data) {
        const { isValid } = this.isValidAndFilterInput(e.data, type);
        if (!isValid) {
          e.preventDefault();

          const textfieldInvalidInputEvent = new CustomEvent('textfield-invalid-input', {
            bubbles: true,
            cancelable: true
          });
          this.dispatchEvent(textfieldInvalidInputEvent);
        }
      }
    });

    this.inputField.addEventListener('input', () => {
      if (this.isComposing) return;
      this.validateLength(maxLength);
      this.updateTextField();

      if (this.inputField) {
        const { isValid } = this.isValidAndFilterInput(this.inputField.value, type);
        if (isValid) {
          this.saveTextFieldValue();

          const textfieldValueChangeEvent = new CustomEvent('textfield-value-change', {
            bubbles: true,
            cancelable: true
          });
          this.dispatchEvent(textfieldValueChangeEvent);
        }
      }
    });
  }

  static get observedAttributes(): string[] {
    return ['status'];
  }

  connectedCallback(): void {
    if (this.parentNode && 'id' in this.parentNode && this.parentNode.id) {
      this.classList.add(this.parentNode.id as string);
    }

    this.getTextFieldValue();

    requestAnimationFrame(() => {
      this.updateTextField();
    });

    if (this.hasAttribute('status')) {
      this.classList.toggle('disabled_text_field', this.getAttribute('status') === 'disabled');
      if (this.inputField) {
        this.inputField.disabled = this.getAttribute('status') === 'disabled';
      }
    }
  }

  validateLength(maxLength: number | null): void {
    if (!this.inputField) return;
    const content = this.inputField.value;
    const length = content.length;

    if (maxLength !== null && length > maxLength) {
      this.inputField.value = content.substring(0, maxLength);
    }
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (name === 'status') {
      const isDisabled = newValue === 'disabled';
      this.classList.toggle('disabled_text_field', isDisabled);
      if (this.inputField) {
        this.inputField.disabled = isDisabled;
        this.updateHint();
      }
    }
    setTimeout(() => window.updateFocusableElements?.(), 10);
  }

  updateTextField(): void {
    this.updateHint();
    this.autoResize();
  }

  updateHint(): void {
    if (!this.inputField || !this.hint) return;
    const content = this.inputField.value;
    const isFocused = document.activeElement?.isSameNode(this.inputField);
    const isDisabled = this.inputField.disabled;

    if (content.length === 0 && (!isFocused || isDisabled)) {
      this.hint.style.opacity = '1';
    } else {
      this.hint.style.opacity = '0';
    }
  }

  autoResize(): void {
    if (!this.inputField) return;

    this.inputField.style.height = 'auto';
    const scrollH = this.inputField.scrollHeight;

    const computedStyle = getComputedStyle(this.inputField);
    let cssMinHeight = 0;
    if (computedStyle.minHeight && computedStyle.minHeight.endsWith('px')) {
      cssMinHeight = parseFloat(computedStyle.minHeight);
    }

    const effectiveMinHeight = Math.max(cssMinHeight, 40);
    const targetHeight = Math.max(scrollH, effectiveMinHeight);

    this.inputField.style.height = targetHeight + 'px';
    this.style.height = targetHeight + 'px';

    getMainHandleScroll();
  }

  isValidAndFilterInput(input: string, type: string): { isValid: boolean; filtered: string } {
    if (type === 'text' || type === 'all' || !type) {
      return { isValid: true, filtered: input === null ? '' : input };
    }

    if (!input && input !== '') {
      return { isValid: true, filtered: input === null ? '' : input };
    }

    let regex: RegExp;
    let filteredInput: string;

    switch (type) {
      case 'number':
        regex = /^[0-9]*$/;
        filteredInput = input.replace(/[^0-9]/g, '');
        break;
      case 'letter':
        regex = /^[a-zA-Z]*$/;
        filteredInput = input.replace(/[^a-zA-Z]/g, '');
        break;
      case 'operator':
        regex = /^[`!@#$%^&*()\-_=+[\]{};':"\\|,.<>/?~]*$/;
        filteredInput = input.replace(/[^`!@#$%^&*()\-_=+[\]{};':"\\|,.<>/?~]/g, '');
        break;
      case 'base':
        regex = /^[0-9a-zA-Z `!@#$%^&*()\-_=+[\]{};':"\\|,.<>/?~]*$/;
        filteredInput = input.replace(/[^0-9a-zA-Z `!@#$%^&*()\-_=+[\]{};':"\\|,.<>/?~]/g, '');
        break;
      case 'none':
        return { isValid: input.length === 0, filtered: '' };
      default:
        return { isValid: true, filtered: input };
    }

    return { isValid: regex.test(input), filtered: filteredInput };
  }

  getValue(): string {
    return this.inputField?.value || '';
  }

  resetValue(): void {
    if (this.inputField) {
      this.inputField.value = '';
      this.updateTextField();
      this.saveTextFieldValue();
    }
  }

  saveTextFieldValue(): void {
    const storageKey = `text_field_value`;
    let storedData: Record<string, string> = {};

    try {
      storedData = JSON.parse(localStorage.getItem(storageKey) || '{}');
    } catch {
      // Ignore errors
    }

    if (!this.inputField) return;
    const currentValue = this.inputField.value;

    if (this.parentElement?.classList.contains('do_not_save')) return;

    const keyInStoredData = this.classList[0];
    if (typeof keyInStoredData !== 'string' || keyInStoredData.trim() === '') {
      return;
    }

    if (currentValue.length === 0) {
      delete storedData[keyInStoredData];
    } else {
      storedData[keyInStoredData as keyof typeof storedData] = currentValue;
    }

    try {
      localStorage.setItem(storageKey, JSON.stringify(storedData));
    } catch {
      // Ignore errors
    }
  }

  getTextFieldValue(): void {
    const storageKey = `text_field_value`;
    let storedData: Record<string, string> = {};

    try {
      storedData = JSON.parse(localStorage.getItem(storageKey) || '{}');
    } catch {
      // Ignore errors
    }

    const keyInStoredData = this.classList[0];
    if (typeof keyInStoredData !== 'string' || keyInStoredData.trim() === '') {
      if (this.inputField) this.inputField.value = '';
      return;
    }

    if (this.inputField) {
      this.inputField.value = (storedData as any)[keyInStoredData] || '';
    }
  }
}


customElements.define('text-field', TextField);
