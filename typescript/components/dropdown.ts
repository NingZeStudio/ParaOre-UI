import { rootPath } from '../types';

export class CustomDropdown extends HTMLElement {
  margin: number = 6;
  optionsData: string[] = [];
  selectedValue: string | null = null;
  label: HTMLDivElement | null = null;
  arrow: HTMLImageElement | null = null;
  dropdownOptions: HTMLDivElement | null = null;
  storageKey: string = '';

  constructor() {
    super();
    this.optionsData = JSON.parse(this.getAttribute('data-option') || '[]');
    this.selectedValue = this.getAttribute('data-selected') || null;

    this.label = document.createElement('div');
    this.label.classList.add('dropdown_label');
    this.appendChild(this.label);

    this.arrow = document.createElement('img');
    this.arrow.classList.add('dropdown_arrow');
    this.arrow.src = rootPath + '/images/arrowDown.png';
    this.appendChild(this.arrow);

    this.dropdownOptions = document.createElement('div');
    this.dropdownOptions.classList.add('dropdown_options');
    this.appendChild(this.dropdownOptions);

    this.optionsData.forEach((labelText, index) => {
      const option = document.createElement('div');
      option.classList.add('dropdown_option');
      option.setAttribute('data-value', (index + 1).toString());
      option.innerHTML = `${labelText} <img alt="" class="dropdown_checkmark" src="${rootPath}/images/check_white.png">`;
      option.addEventListener('click', () => this.selectOption(option));
      this.dropdownOptions?.appendChild(option);
    });

    this.storageKey = `(${rootPath}/)dropdown_value`;
    const storedData = this.getStoredDropdownData();
    this.selectedValue = storedData[this.id] || this.selectedValue;

    this.addEventListener('click', () => this.toggleOptions());
    this.updateLabel();
    this.renderOptions();
    document.addEventListener('mousedown', (e) => this.handleOutsideClick(e));
    document.addEventListener('touchstart', (e) => this.handleOutsideClick(e));
  }

  static get observedAttributes(): string[] {
    return ['status'];
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (name === 'status' && this.label && this.arrow) {
      this.label.classList.toggle('disabled_dropdown', newValue === 'disabled');
      this.arrow.classList.toggle('disabled_dropdown_arrow', newValue === 'disabled');
    }
    setTimeout(() => window.updateFocusableElements?.(), 10);
  }

  getStoredDropdownData(): Record<string, string> {
    const storedData = localStorage.getItem(this.storageKey);
    return storedData ? JSON.parse(storedData) : {};
  }

  saveDropdownData(data: Record<string, string>): void {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  toggleOptions(): void {
    if (this.getAttribute('status') === 'disabled' || !this.dropdownOptions) return;

    const isVisible = this.dropdownOptions.style.display === 'block';
    this.dropdownOptions.style.display = isVisible ? 'none' : 'block';
    
    const dropdownContainer = this.closest('.dropdown_container') as HTMLElement;
    if (dropdownContainer && this.label) {
      dropdownContainer.style.height = isVisible
        ? `${this.label.offsetHeight + this.margin}px`
        : `${this.dropdownOptions?.scrollHeight + this.margin}px`;
    }

    if (window.mainHandleScroll) window.mainHandleScroll();
  }

  selectOption(option: Element): void {
    if (this.getAttribute('status') === 'disabled') return;

    const value = option.getAttribute('data-value');
    if (this.selectedValue !== value) {
      this.selectedValue = value;
      this.updateLabel();
      this.renderOptions();

      const storedData = this.getStoredDropdownData();
      storedData[this.id] = this.selectedValue || '';
      this.saveDropdownData(storedData);
    }
  }

  updateLabel(): void {
    if (!this.label) return;
    const selectedIndex = this.selectedValue ? parseInt(this.selectedValue) - 1 : 0;
    this.label.innerHTML = this.optionsData[selectedIndex] || this.getAttribute('unselected-text') || '选择一个选项';

    const dropdownValueChangeEvent = new CustomEvent('dropdown-value-change', {
      bubbles: true,
      cancelable: true,
      detail: { value: this.selectedValue }
    });
    this.dispatchEvent(dropdownValueChangeEvent);
  }

  renderOptions(): void {
    if (!this.dropdownOptions) return;
    this.dropdownOptions.querySelectorAll('.dropdown_option').forEach(option => {
      const isSelected = option.getAttribute('data-value') === this.selectedValue;
      option.classList.toggle('selected', isSelected);
      const checkmark = option.querySelector('.dropdown_checkmark') as HTMLImageElement;
      if (checkmark) {
        checkmark.style.display = isSelected ? 'block' : 'none';
      }
    });
  }

  handleOutsideClick(e: MouseEvent | TouchEvent): void {
    const isVisible = this.dropdownOptions?.style.display === 'block';
    if (!isVisible) return;
    if (!this.contains(e.target as Node)) {
      if (this.dropdownOptions) {
        this.dropdownOptions.style.display = 'none';
      }
      const dropdownContainer = this.closest('.dropdown_container') as HTMLElement;
      if (dropdownContainer && this.label) {
        dropdownContainer.style.height = `${this.label.offsetHeight + this.margin}px`;
      }
      if (window.mainHandleScroll) window.mainHandleScroll();
    }
  }
}

customElements.define('custom-dropdown', CustomDropdown);
