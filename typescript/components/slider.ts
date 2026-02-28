import { rootPath } from '../types';

export class CustomSlider extends HTMLElement {
  isFirstRender: boolean = true;

  constructor() {
    super();
  }

  static get observedAttributes(): string[] {
    return ['status'];
  }

  connectedCallback(): void {
    if (this.isFirstRender) {
      this.render();
      this.isFirstRender = false;
    }
  }

  attributeChangedCallback(): void {
    if (!this.isFirstRender) {
      this.render();
      setTimeout(() => window.updateFocusableElements?.(), 10);
    }
  }

  render(): void {
    this.innerHTML = `
      <div class="slider_area">
        <div>Selected: <span class="slider_tooltip">0.00</span></div>
        <div class="slider_content">
          <div class="slider">
            <div class="slider_process"></div>
            <div class="slider_slider"></div>
            <div class="slider_segment" style="display: none"></div>
          </div>
        </div>
      </div>
    `;

    const content = this.querySelector('.slider_content') as HTMLElement;
    const tooltip = this.querySelector('.slider_tooltip') as HTMLElement;
    const slider = this.querySelector('.slider') as HTMLElement;
    const process = this.querySelector('.slider_process') as HTMLElement;
    const handle = this.querySelector('.slider_slider') as HTMLElement;
    const sliderData = JSON.parse(this.getAttribute('data-slider') || '{}');
    
    const minValue = sliderData.minValue || 0;
    const maxValue = sliderData.maxValue || 100;
    const segments = sliderData.segments || 10;
    const initialValue = sliderData.initialValue || minValue;
    const showSegments = this.getAttribute('data-show-segments');
    const customSegments = this.getAttribute('data-custom-segments') === 'true';
    const segmentValues = customSegments ? JSON.parse(this.getAttribute('data-segment-values') || '[]') : [];
    const isDisabled = this.getAttribute('status') === 'disabled';
    const type = this.getAttribute('type') || 'range';
    const sliderId = this.id;

    let currentValue = initialValue;
    let isDragging = false;

    const storedIndex = getSliderValue(sliderId);
    if (storedIndex !== null) {
      currentValue = storedIndex;
    }

    function formatIntegerValue(value: number): string {
      return value.toFixed(2).replace(/\.?0+$/, '');
    }

    function formatDecimalValue(value: number): string {
      return value.toFixed(2);
    }

    function updateHandle(position: number): void {
      handle.style.left = position + '%';
      process.style.width = position + '%';
    }

    function updateTooltip(position: number): void {
      if (type === 'set') {
        const segmentIndex = Math.round(position / (100 / segments));
        const segmentValue = customSegments
          ? segmentValues[segmentIndex]
          : minValue + segmentIndex * (maxValue - minValue) / segments;
        tooltip.textContent = customSegments
          ? segmentValue.toString()
          : formatIntegerValue(segmentValue);
      } else {
        if (position === 0 || position === 100) {
          tooltip.textContent = formatIntegerValue(calculateValue(position));
        } else {
          tooltip.textContent = formatDecimalValue(calculateValue(position));
        }
      }
    }

    function calculatePosition(value: number): number {
      return ((value - minValue) / (maxValue - minValue)) * 100;
    }

    function calculateValue(position: number): number {
      return (position * (maxValue - minValue)) / 100 + minValue;
    }

    function changeValue(position: number): void {
      updateHandle(position);
      updateTooltip(position);
      saveSliderValue();

      const sliderValueChangeEvent = new CustomEvent('slider-value-change', {
        bubbles: true,
        cancelable: true
      });
      slider.dispatchEvent(sliderValueChangeEvent);
    }

    function setSliderValue(position: number): void {
      currentValue = (position * (maxValue - minValue)) / 100 + minValue;
      changeValue(position);
    }

    function snapToSegment(position: number): void {
      const segmentIndex = Math.round(position / (100 / segments));
      const segmentPosition = segmentIndex * (100 / segments);
      currentValue = minValue + segmentIndex * (maxValue - minValue) / segments;
      changeValue(segmentPosition);
    }

    function getSliderValue(id: string): number | null {
      const sliderStorage = JSON.parse(localStorage.getItem(`(${rootPath}/)slider_value`) || '{}');
      return sliderStorage[id] !== undefined ? sliderStorage[id] : null;
    }

    function saveSliderValue(): void {
      const sliderStorage = JSON.parse(localStorage.getItem(`(${rootPath}/)slider_value`) || '{}');
      sliderStorage[sliderId] = currentValue;
      localStorage.setItem(`(${rootPath}/)slider_value`, JSON.stringify(sliderStorage));
    }

    updateHandle(calculatePosition(currentValue));
    updateTooltip(calculatePosition(currentValue));

    if (type === 'range') {
      if (showSegments === null || showSegments === 'true') {
        const minValueLabel = document.createElement('div');
        minValueLabel.classList.add('slider_value_info');
        minValueLabel.textContent = formatIntegerValue(minValue);
        minValueLabel.style.position = 'absolute';
        minValueLabel.style.bottom = '-35px';
        slider.appendChild(minValueLabel);
        const minValueLabelWidth = minValueLabel.offsetWidth;
        minValueLabel.style.left = `calc(0% - ${minValueLabelWidth / 2}px)`;

        const maxValueLabel = document.createElement('div');
        maxValueLabel.classList.add('slider_value_info');
        maxValueLabel.textContent = formatIntegerValue(maxValue);
        maxValueLabel.style.position = 'absolute';
        maxValueLabel.style.bottom = '-35px';
        slider.appendChild(maxValueLabel);
        const maxValueLabelWidth = maxValueLabel.offsetWidth;
        maxValueLabel.style.left = `calc(100% - ${maxValueLabelWidth / 2}px)`;
      }
    } else if (type === 'set') {
      for (let i = 0; i <= segments; i++) {
        if (i > 0 && i < segments) {
          const segment = document.createElement('div');
          segment.classList.add('slider_segment');
          segment.style.left = `calc(${(i / segments) * 100}% - 1px)`;
          slider.appendChild(segment);
        }

        if (showSegments === 'true') {
          const segmentValueLabel = document.createElement('div');
          const segmentValue = customSegments
            ? segmentValues[i]
            : minValue + i * (maxValue - minValue) / segments;
          segmentValueLabel.classList.add('slider_value_info');
          segmentValueLabel.textContent = customSegments
            ? segmentValue.toString()
            : formatIntegerValue(segmentValue);
          segmentValueLabel.style.position = 'absolute';
          segmentValueLabel.style.bottom = '-35px';
          slider.appendChild(segmentValueLabel);
          const segmentValueLabelWidth = segmentValueLabel.offsetWidth;
          segmentValueLabel.style.left = `calc(${(i / segments) * 100}% - ${segmentValueLabelWidth / 2}px)`;
        }
      }
    }

    if (isDisabled) {
      handle.classList.add('disabled_slider');
      slider.classList.add('disabled_slider');
      return;
    }

    const startDrag = (event: Event): void => {
      process.style.transition = 'none';
      handle.style.transition = 'none';
      isDragging = true;
      event.preventDefault();
      updatePosition(event);
    };

    const stopDrag = (): void => {
      setTimeout(() => {
        isDragging = false;
      }, 0);
      process.style.transition = 'width 100ms linear';
      handle.style.transition = 'left 100ms linear';
    };

    const updatePosition = (event: Event): void => {
      setTimeout(() => {
        if (!isDragging) return;
        const position = currentPosition(event);
        setSliderValue(position);
      }, 0);
    };

    const currentPosition = (event: Event): number => {
      const rect = slider.getBoundingClientRect();
      let position: number;

      if ('touches' in event && event.touches && (event.touches as TouchList).length > 0) {
        position = (((event.touches as TouchList)[0].clientX - rect.left) / rect.width) * 100;
      } else if ('changedTouches' in event && event.changedTouches && (event.changedTouches as TouchList).length > 0) {
        position = (((event.changedTouches as TouchList)[0].clientX - rect.left) / rect.width) * 100;
      } else if ('clientX' in event) {
        position = (((event as MouseEvent).clientX - rect.left) / rect.width) * 100;
      } else {
        position = 0;
      }

      return Math.max(0, Math.min(position, 100));
    };

    handle.addEventListener('mousedown', startDrag);
    handle.addEventListener('touchstart', startDrag);
    window.addEventListener('mousemove', updatePosition as EventListener);
    window.addEventListener('touchmove', updatePosition as EventListener);
    window.addEventListener('mouseup', stopDrag);
    window.addEventListener('touchend', stopDrag);

    content.addEventListener('click', (event) => {
      if (isDragging) return;
      const position = currentPosition(event);
      if (type === 'set') {
        snapToSegment(position);
      } else {
        setSliderValue(position);
      }
    });

    handle.addEventListener('keydown', (event: KeyboardEvent) => {
      const step = sliderData.step || 1;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp' || event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault();
        
        if (type === 'set') {
          let segmentIndex = Math.round(((currentValue - minValue) / (maxValue - minValue)) * segments);
          if (event.key === 'ArrowLeft') segmentIndex = Math.max(0, segmentIndex - 1);
          else if (event.key === 'ArrowUp') segmentIndex = segments;
          else if (event.key === 'ArrowRight') segmentIndex = Math.min(segments, segmentIndex + 1);
          else if (event.key === 'ArrowDown') segmentIndex = 0;
          
          currentValue = minValue + segmentIndex * (maxValue - minValue) / segments;
          const newPosition = (segmentIndex / segments) * 100;
          snapToSegment(newPosition);
        } else {
          if (event.key === 'ArrowLeft') currentValue = Math.max(minValue, currentValue - step);
          else if (event.key === 'ArrowUp') currentValue = maxValue;
          else if (event.key === 'ArrowRight') currentValue = Math.min(maxValue, currentValue + step);
          else if (event.key === 'ArrowDown') currentValue = minValue;
          
          const newPosition = calculatePosition(currentValue);
          setSliderValue(newPosition);
        }
      }
    });
  }
}

customElements.define('custom-slider', CustomSlider);
