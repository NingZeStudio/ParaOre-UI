export declare class DisplaySidebar extends HTMLElement {
    private isOpen;
    private isPersistent;
    private overlay;
    private resizeHandler;
    constructor();
    static get observedAttributes(): string[];
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(_name: string, _oldValue: string | null, _newValue: string | null): void;
    /**
     * 渲染侧边栏内部元素
     */
    private render;
    /**
     * 创建遮罩层
     */
    private createOverlay;
    /**
     * 检查是否为持久化模式（大屏幕）
     */
    private checkPersistent;
    /**
     * 初始化侧边栏状态
     */
    private init;
    /**
     * 窗口大小变化处理
     */
    private handleResize;
    /**
     * 更新侧边栏状态
     */
    private updateState;
    /**
     * 更新主滚动区域类名
     */
    private updateMainScrollView;
    /**
     * 打开侧边栏
     */
    open(): void;
    /**
     * 关闭侧边栏
     */
    close(): void;
    /**
     * 切换侧边栏状态
     */
    toggle(): void;
    /**
     * 保存状态到 localStorage
     */
    private saveState;
}
