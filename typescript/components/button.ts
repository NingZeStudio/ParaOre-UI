export class CustomButton extends HTMLElement {
  status: string = 'normal';
  icon: string = '';

  constructor() {
    super();
    this.render();
  }

  static get observedAttributes(): string[] {
    return ['data', 'js', 'text'];
  }

  attributeChangedCallback(): void {
    this.render();
    setTimeout(() => window.updateFocusableElements?.(), 10);
  }

  render(): void {
    const data = this.getAttribute('data') || '';
    const [type, status, size, id, isTip, tip, icon] = data.split('|').map(item => item.trim());
    this.status = status || 'normal';
    this.icon = icon || '';
    const ctype = type || 'default';
    const csize = size || 'middle';
    const cid = id || '';
    const cisTip = isTip === 'true';
    const ctip = tip || '';
    const js = this.getAttribute('js') || 'false';
    const text = this.getAttribute('text') || '';

    if (ctype === 'default') {
      if (cisTip) {
        this.innerHTML = `
          <div class="btn_with_tooltip_cont">
            <button class="btn ${csize}_btn ${status}_btn" id="${cid}">${text}</button>
            <div class="btn_tooltip">${ctip}</div>
            <div class="tip_icon" style="background-image: url('images/${icon}.png')"></div>
          </div>
        `;
      } else {
        this.innerHTML = `<button class="btn ${csize}_btn ${status}_btn" id="${cid}">${text}</button>`;
      }
    } else {
      this.classList.add(ctype + '_custom_btn');
      this.innerHTML = `<button class="btn ${status}_btn ${ctype}_btn" id="${cid}">${text}</button>`;
    }

    const button = this.querySelector('button') as HTMLButtonElement;
    if (button) {
      button.addEventListener('click', () => {
        const buttonClickEvent = new CustomEvent('button-click', {
          bubbles: true,
          cancelable: true
        });
        this.dispatchEvent(buttonClickEvent);
      });

      if (this.status !== 'disabled' && js !== 'false') {
        button.addEventListener('click', () => {
          try {
            eval(js);
          } catch {
            // Ignore errors
          }
        });
      }
    }
  }
}

customElements.define('custom-button', CustomButton);
