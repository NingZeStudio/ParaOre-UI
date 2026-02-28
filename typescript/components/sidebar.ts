export class DisplaySidebar extends HTMLElement {
  private isOpen: boolean = false;
  private isPersistent: boolean = false;
  private overlay: HTMLElement | null = null;
  private resizeHandler: () => void;

  constructor() {
    super();
    this.resizeHandler = this.handleResize.bind(this);
  }

  static get observedAttributes(): string[] {
    return ['open', 'persistent'];
  }

  connectedCallback(): void {
    
    this.checkPersistent();
    
    
    this.render();
    
    
    this.createOverlay();
    
    
    this.init();
    
    
    window.addEventListener('resize', this.resizeHandler);
  }

  disconnectedCallback(): void {
    window.removeEventListener('resize', this.resizeHandler);
  }

  attributeChangedCallback(_name: string, _oldValue: string | null, _newValue: string | null): void {
    if (_name === 'open') {
      this.updateState();
    } else if (_name === 'persistent') {
      this.checkPersistent();
    }
  }

  /**
   * 渲染侧边栏内部元素
   */
  private render(): void {
    const closeBtn = this.querySelector('#btn_close_sidebar');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.close();
      });
    }
  }

  /**
   * 创建遮罩层
   */
  private createOverlay(): void {
    let overlay = document.getElementById('sidebar-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'sidebar-overlay';
      overlay.className = 'sidebar-overlay';
      overlay.addEventListener('click', () => this.close());
      document.body.appendChild(overlay);
    }
    this.overlay = overlay;
  }

  /**
   * 检查是否为持久化模式（大屏幕）
   */
  private checkPersistent(): void {
    this.isPersistent = window.innerWidth >= 1200;
    if (this.isPersistent) {
      this.setAttribute('persistent', '');
    } else {
      this.removeAttribute('persistent');
    }
  }

  /**
   * 初始化侧边栏状态
   */
  private init(): void {
    
    this.removeAttribute('open');
    this.updateState();
  }

  /**
   * 窗口大小变化处理
   */
  private handleResize(): void {
    this.checkPersistent();
    this.updateState();
  }

  /**
   * 更新侧边栏状态
   */
  private updateState(): void {
    const isOpen = this.hasAttribute('open');
    this.isOpen = isOpen;

    if (isOpen) {
      this.classList.remove('closed');
      this.classList.add('open');
      
      if (!this.isPersistent && this.overlay) {
        this.overlay.classList.add('visible');
        document.body.style.overflow = 'hidden';
      }
    } else {
      this.classList.add('closed');
      this.classList.remove('open');
      if (this.overlay) {
        this.overlay.classList.remove('visible');
        document.body.style.overflow = '';
      }
    }

    this.updateMainScrollView();
    this.saveState();
  }

  /**
   * 更新主滚动区域类名
   */
  private updateMainScrollView(): void {
    const mainScrollView = document.querySelector('.main_scroll_view');
    if (mainScrollView) {
      if (this.isOpen) {
        mainScrollView.classList.add('with_sidebar');
      } else {
        mainScrollView.classList.remove('with_sidebar');
      }
    }
  }

  /**
   * 打开侧边栏
   */
  open(): void {
    this.setAttribute('open', '');
    this.dispatchEvent(new CustomEvent('sidebar-open', { bubbles: true }));
  }

  /**
   * 关闭侧边栏
   */
  close(): void {
    this.removeAttribute('open');
    this.dispatchEvent(new CustomEvent('sidebar-close', { bubbles: true }));
  }

  /**
   * 切换侧边栏状态
   */
  toggle(): void {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * 保存状态到 localStorage
   */
  private saveState(): void {
    if (this.isPersistent) return;
    localStorage.setItem('sidebar_open', this.isOpen.toString());
  }
}

customElements.define('display-sidebar', DisplaySidebar);
