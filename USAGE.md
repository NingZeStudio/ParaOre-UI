# ParaOre-UI Usage Guide

## Installation

```bash
npm install @ningze/paraore-ui
```

## Usage

### CSS
```html
<link rel="stylesheet" href="node_modules/@ningze/paraore-ui/dist/paraore-ui.css">
```

### Sass
```scss
@use '@ningze/paraore-ui';
```

### JavaScript
```html
<script type="module">
  import { showModal, hideModal, scrollToTop, openLink } from '@ningze/paraore-ui/dist/js/paraore-ui.js';

  // Modal usage
  showModal('modal-id');
  hideModal('modal-id');

  // Scroll utilities
  scrollToTop();  // Smooth scroll to top
  toTop();        // Instant scroll to top

  // Navigation utilities
  openLink('https://example.com');
  launchApplication('myapp://path');
</script>
```

### TypeScript (with full type support)
```typescript
import { showModal, hideModal, CustomButton, DisplaySidebar } from '@ningze/paraore-ui';

// 完整的 TypeScript 类型提示
showModal('modal-id');

const sidebar = document.getElementById('sidebar') as DisplaySidebar;
sidebar?.toggle();
```

## Components

### Buttons
```html
<button class="btn normal_btn">Normal</button>
<button class="btn green_btn">Confirm</button>
<button class="btn red_btn">Cancel</button>
<button class="btn disabled_btn" disabled>Disabled</button>

<!-- Auto width button -->
<button class="btn normal_btn auto_width_btn">Auto Width</button>

<!-- Button group -->
<div class="btn_group">
    <button class="btn normal_btn">Button 1</button>
    <button class="btn normal_btn">Button 2</button>
</div>
```

### Checkbox
```html
<label class="checkbox-label">
    <div class="custom-checkbox">
        <input type="checkbox" checked>
        <img alt="" class="checkmark" src="check_white.png"/>
    </div>
    <span>Checked</span>
</label>

<!-- Or use Web Component -->
<custom-checkbox id="demo" status="enabled" active="on"></custom-checkbox>
```

### Radio
```html
<label class="radio-label">
    <div class="custom-radio">
        <input type="radio" name="group" checked>
        <span class="radio-mark"></span>
    </div>
    <span>Option 1</span>
</label>

<!-- Or use Web Component -->
<custom-radio id="demo" name="group" status="enabled" active="on"></custom-radio>
```

### Sidebar
```html
<!-- Sidebar (outside of dispaly-area) -->
<display-sidebar id="sidebar">
    <div class="sidebar_header">
        <span class="sidebar_title">Title</span>
    </div>
    <div class="sidebar_content">
        <nav class="sidebar_nav">
            <a href="#" class="sidebar_nav_link active">Home</a>
            <a href="#" class="sidebar_nav_link">About</a>
        </nav>
        <divider></divider>
        <button class="btn sidebar_btn" id="btn_close_sidebar">Close</button>
    </div>
</display-sidebar>

<dispaly-area>
    <header>
        <!-- Toggle button (hidden on large screens) -->
        <div class="header_item header_item_left sidebar_toggle_btn" id="btn_toggle_sidebar">
            <img class="link_img" src="menu-icon.svg" alt=""/>
        </div>
        <div class="header_logo">
            <div class="header_title">Title</div>
        </div>
    </header>
    
    <display-body>
        <scroll-view class="main_scroll_view with_sidebar">
            <scroll-container class="primary_scroll_container">
                <main class="scroll_container">
                    <!-- Content -->
                </main>
            </scroll-container>
            <custom-scrollbar class="primary_custom_scrollbar">
                <custom-scrollbar-track></custom-scrollbar-track>
                <custom-scrollbar-thumb></custom-scrollbar-thumb>
            </custom-scrollbar>
        </scroll-view>
    </display-body>
</dispaly-area>

<script type="module">
    import { DisplaySidebar } from '@ningze/paraore-ui/dist/js/paraore-ui.js';
    
    const sidebar = document.getElementById('sidebar');
    const btnToggle = document.getElementById('btn_toggle_sidebar');
    const btnClose = document.getElementById('btn_close_sidebar');
    
    btnToggle?.addEventListener('click', () => sidebar?.toggle());
    btnClose?.addEventListener('click', () => sidebar?.close());
</script>
```

**Sidebar Features:**
- Responsive: persistent on large screens (≥1200px), collapsible on small screens
- Automatic overlay creation for mobile
- State persistence via localStorage
- Keyboard and touch friendly

### Banner
```html
<div class="banner neutral_banner">Neutral</div>
<div class="banner information_banner">Information</div>
<div class="banner important_banner">Important</div>
```

### Badge
```html
<div class="badge_area">
    <span class="badge green_badge"></span>
    <span class="badge blue_badge"></span>
    <span class="badge yellow_badge"></span>
    <span class="badge red_badge"></span>
</div>
```

### Divider
```html
<divider></divider>
<divider-box></divider-box>
<line></line>
```

### Article
```html
<article_block>
    <article_title>Title</article_title>
    <article_subtitle>Subtitle</article_subtitle>
    <article_detail>
        <p>Content...</p>
        <article_note>Note</article_note>
        <article_list>Item</article_list>
    </article_detail>
</article_block>
```

### Header
```html
<header>
    <div class="header_item header_item_left">
        <img class="link_img" src="icon.png" alt=""/>
    </div>
    <div class="header_logo">
        <div class="header_title">Title</div>
    </div>
    <div class="header_item header_item_right">
        <a href="https://github.com" target="_blank">
            <img class="header_right_icon" src="github.png" alt="GitHub"/>
        </a>
    </div>
</header>
```

### Modal
```html
<!-- Trigger button -->
<button class="btn normal_btn" id="btn_open">Open Modal</button>

<!-- Overlay -->
<div class="overlay" id="overlay_demo"></div>

<!-- Modal area -->
<modal_area id="demo_modal">
    <modal>
        <modal_title_area>
            <modal_title>Modal Title</modal_title>
            <modal_close_btn id="btn_close">&times;</modal_close_btn>
        </modal_title_area>
        <modal_content>
            <p>Modal content here...</p>
        </modal_content>
    </modal>
</modal_area>

<script type="module">
    import { showModal, hideModal } from '@ningze/paraore-ui/dist/js/paraore-ui.js';
    
    document.getElementById('btn_open')?.addEventListener('click', () => {
        showModal('demo_modal');
    });
    
    document.getElementById('btn_close')?.addEventListener('click', () => {
        hideModal('demo_modal');
    });
</script>
```

### Layout
```html
<dispaly-area>
    <header>...</header>
    <display-body>
        <scroll-view>
            <scroll-container class="primary_scroll_container">
                <main class="scroll_container">...</main>
            </scroll-container>
            <custom-scrollbar class="primary_custom_scrollbar">
                <custom-scrollbar-track></custom-scrollbar-track>
                <custom-scrollbar-thumb></custom-scrollbar-thumb>
            </custom-scrollbar>
        </scroll-view>
    </display-body>
</dispaly-area>
```

## Build Commands

```bash
npm run build        # Build CSS + JS + Types (production)
npm run build:css    # Build CSS only (compressed)
npm run build:js     # Build JS only (bundled)
npm run build:types  # Build TypeScript declarations
npm run build:dev    # Build CSS + JS (development with source maps)
npm run dev-css      # Build CSS with source maps
npm run dev-js       # Build JS with source maps
npm run watch        # Watch mode
npm run lint         # ESLint check
```

## Publish

```bash
npm run publish:npm
```

## Notes

### Component Architecture
- **CSS-only components**: Buttons, banners, badges, dividers, etc.
- **Web Components**: Checkbox, radio, dropdown, scrollbar, sidebar, modal, etc.
- **Utility functions**: `showModal()`, `hideModal()`, `scrollToTop()`, etc.

### TypeScript Support
- Full type declarations included in the npm package
- Import directly from `@ningze/paraore-ui` in TypeScript projects
- Type definitions located at `dist/types/`

### Responsive Design
- Large screen (≥1200px): Sidebar is persistent, toggle button hidden
- Small screen (<1200px): Sidebar is collapsible with overlay

### Browser Support
- Modern browsers with Web Components support
- ES6+ JavaScript
