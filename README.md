<div align="center">

# ParaOre-UI

### A Sass/CSS component library based on the Mojang OreUI design language
### *一款基于 Mojang OreUI 设计语言的 Sass/CSS 组件库*

[![npm](https://img.shields.io/npm/v/@ningze/paraore-ui?color=eac54f&style=for-the-badge&label=npm)](https://www.npmjs.com/package/@ningze/paraore-ui)
[![License](https://img.shields.io/badge/License-MIT-ff69b4?style=for-the-badge)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/NingZeStudio/ParaOre-UI?style=for-the-badge&color=blue)](https://github.com/NingZeStudio/ParaOre-UI/stargazers)

</div>

---

> [!CAUTION]
> **法律风险提示**：Mojang 开源了 OreUI 的状态管理代码，但 OreUI 样式本身的版权状态尚不明确。此组件库可能存在版权法律问题，**请谨慎使用！**

---

## Quick Start

### Installation

```bash
npm install @ningze/paraore-ui
```

### Usage

#### CSS
```html
<link rel="stylesheet" href="node_modules/@ningze/paraore-ui/dist/paraore-ui.css">
```

#### Sass
```scss
@use '@ningze/paraore-ui';
```

#### TypeScript/JavaScript
```html
<script type="module">
  import { showModal, hideModal, scrollToTop, openLink } from '@ningze/paraore-ui/dist/js/paraore-ui.js';
</script>
```

#### TypeScript (with type support)
```typescript
import { showModal, CustomButton, DisplaySidebar } from '@ningze/paraore-ui';

// 完整的 TypeScript 类型提示支持
showModal('modal-id');
```

### Build

```bash
npm run build        # Build CSS + JS + Types (production)
npm run build:css    # Build CSS only (compressed)
npm run build:js     # Build JS only (bundled)
npm run build:types  # Build TypeScript declarations
npm run build:dev    # Build CSS + JS (development with source maps)
npm run dev-css      # Build CSS with source maps
npm run dev-js       # Build JS with source maps
npm run watch        # Watch mode for Sass
npm run lint         # ESLint check
```

---

## Components

### CSS Components

| Component | Description |
|-----------|-------------|
| Buttons | `.btn`, `.normal_btn`, `.green_btn`, `.red_btn`, `.auto_width_btn` |
| Checkbox | `.custom-checkbox` (pure CSS with CSS checkmark) |
| Radio | `.custom-radio` (pure CSS) |
| Dropdown | `<custom-dropdown>` |
| Scrollbar | `<custom-scrollbar>` |
| Sidebar | `<display-sidebar>`, `.sidebar_btn`, `.sidebar_nav` |
| Banner | `.banner` |
| Badge | `.badge` |
| Divider | `<divider>`, `<line>` |
| Article | `<article_block>` |
| Header | `<header>` |
| Loading | `.loading_mask` |
| Slider | `.slider` |
| Switch | `.switch` |
| Tag | `.tag` |
| Text Field | `.input`, `text-field` |
| Modal | `modal`, `modal_area` |

### JavaScript/TypeScript Components

| Component | Description |
|-----------|-------------|
| CustomButton | `<custom-button>` Web Component |
| CustomCheckbox | `<custom-checkbox>` Web Component |
| CustomRadio | `<custom-radio>` Web Component |
| CustomDropdown | `<custom-dropdown>` Web Component |
| CustomSlider | `<custom-slider>` Web Component |
| CustomSwitch | `<custom-switch>` Web Component |
| CustomScrollbar | `<custom-scrollbar>` Web Component |
| TextField | `<text-field>` Web Component |
| DisplaySidebar | `<display-sidebar>` Web Component |
| Modal | `showModal()`, `hideModal()` functions |
| Scroll | Custom scrollbar logic, `scrollToTop()`, `toTop()` |
| Utils | `ifNavigating()`, `openLink()`, `launchApplication()` |

---

## Directory Structure

```
ParaOre-UI/
├── sass/
│   ├── base/              # Variables, mixins, reset
│   ├── components/        # Button, checkbox, sidebar, modal, etc.
│   ├── layout/            # Header, main layout
│   ├── utilities/         # Helpers
│   └── paraore-ui.scss    # Main entry
├── typescript/
│   ├── components/        # Web Components
│   ├── types.ts
│   ├── global.d.ts
│   ├── public_script.ts   # Utility functions
│   ├── load.ts
│   └── index.ts           # Main entry
├── dist/                  # Built files
│   ├── js/                # Bundled JavaScript
│   ├── types/             # TypeScript declarations (.d.ts)
│   ├── paraore-ui.css     # Compiled CSS
│   └── fonts/, images/    # Assets
├── fonts/                 # Custom fonts
├── images/                # Image assets
├── example/               # Demo pages
├── USAGE.md               # Usage guide
├── package.json
├── tsconfig.json
├── eslint.config.js
└── README.md
```

---

## License

MIT License

---

## Links

- 参考项目：https://github.com/Spectrollay/OreUI
- npm: https://www.npmjs.com/package/@ningze/paraore-ui
- Author: JanePHPDev (@JanePHPDev) - NingZeStudio
