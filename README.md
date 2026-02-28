<div align="center">

<b>⚠️ 我们仍在开发中，暂时不要使用！</b>  
<b>⚠️ 我们仍在开发中，暂时不要使用！</b>  
<b>⚠️ 我们仍在开发中，暂时不要使用！</b>  

# ParaOre-UI

### A Minecraft-inspired Sass/CSS Component Library

[![npm](https://img.shields.io/npm/v/@ningze/paraore-ui?color=eac54f&style=for-the-badge&label=npm)](https://www.npmjs.com/package/@ningze/paraore-ui)
[![License](https://img.shields.io/badge/License-MIT-ff69b4?style=for-the-badge)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/NingZeStudio/ParaOre-UI?style=for-the-badge&color=blue)](https://github.com/NingZeStudio/ParaOre-UI/stargazers)

</div>

---

> [!CAUTION]
> **法律风险提示**：我们目前已知的是 Mojang 开源了 OreUI 的状态管理，并不知道 OreUI 样式本身版权状态，此组件库可能存在版权法律问题，**请谨慎使用！**

---

## 📦 Quick Start

### Installation

```bash
npm install @ningze/paraore-ui
```

### Usage

```html
<link rel="stylesheet" href="node_modules/@ningze/paraore-ui/dist/paraore-ui.css">
```

```scss
@use '@ningze/paraore-ui';
```

### TypeScript Usage

```html
<script type="module">
  import { CustomButton, CustomCheckbox, showModal } from '@ningze/paraore-ui/dist/js/paraore-ui.js';
</script>
```

### Build

```bash
npm run build        # Build CSS + JS (production)
npm run build:css    # Build CSS only (compressed)
npm run build:js     # Build JS only (bundled)
npm run build:dev    # Build CSS + JS (development with source maps)
npm run dev-css      # Build CSS with source maps
npm run dev-js       # Build JS with source maps
npm run watch        # Watch mode for Sass
```

---

## Components

### CSS Components

| Component | Description |
|-----------|-------------|
| Buttons | `.btn`, `.normal_btn`, `.green_btn`, `.red_btn` |
| Checkbox | `.custom-checkbox` (pure CSS with CSS checkmark) |
| Radio | `.custom-radio` (pure CSS) |
| Dropdown | `<custom-dropdown>` |
| Scrollbar | `<custom-scrollbar>` |
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
| CustomDropdown | `<custom-dropdown>` Web Component |
| CustomSlider | `<custom-slider>` Web Component |
| CustomSwitch | `<custom-switch>` Web Component |
| TextField | `<text-field>` Web Component |
| Modal | `showModal()`, `hideModal()` functions |
| Scroll | Custom scrollbar logic |
| Utils | `ifNavigating()`, `openLink()`, `scrollToTop()`, etc. |

---

## Directory Structure

```
ParaOre-UI/
├── sass/
│   ├── base/
│   ├── components/
│   ├── layout/
│   ├── utilities/
│   └── paraore-ui.scss
├── typescript/
│   ├── components/
│   ├── types.ts
│   ├── global.d.ts
│   ├── public_script.ts
│   ├── load.ts
│   └── index.ts
├── dist/
├── fonts/
├── images/
├── example/
│   └── index.html
├── USAGE.md
├── package.json
├── tsconfig.json
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
