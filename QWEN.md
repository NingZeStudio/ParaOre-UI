# ParaOre-UI Project Context

## Overview

**ParaOre-UI** is a Sass/CSS component library inspired by Minecraft OreUI design.

- **Author**: JanePHPDev (@JanePHPDev) - NingZeStudio
- **Type**: Pure CSS/Sass component library
- **License**: MIT
- **npm**: `@ningze/paraore-ui`

## Directory Structure

```
ParaOre-UI/
├── sass/
│   ├── base/
│   │   ├── _variables.scss
│   │   ├── _mixins.scss
│   │   └── _reset.scss
│   ├── components/
│   │   ├── _buttons.scss
│   │   ├── _checkbox.scss
│   │   ├── _dropdown.scss
│   │   ├── _scrollbar.scss
│   │   ├── _banner-badge.scss
│   │   ├── _divider.scss
│   │   ├── _article.scss
│   │   └── _loading.scss
│   ├── layout/
│   │   ├── _header.scss
│   │   └── _main.scss
│   ├── utilities/
│   │   └── _helpers.scss
│   └── paraore-ui.scss
├── dist/
│   └── paraore-ui.css
├── fonts/
├── images/
├── example.html
├── USAGE.md
├── package.json
└── README.md
```

## Build Commands

```bash
npm install
npm run build
npm run build:dev
npm run watch
npm run clean
```

## Design Tokens

Located in `sass/base/_variables.scss`:

- Colors: `$color-*`
- Fonts: `$font-family-*`, `$font-size-*`
- Spacing: `$spacing-*`
- Borders: `$border-width-*`
- Shadows: `$btn-shadow-*`
- Sizes: `$btn-*`, `$icon-*`, `$scrollbar-*`
- Breakpoints: `$breakpoint-lg`

## Components

- Buttons: `.btn`, `.normal_btn`, `.green_btn`, `.red_btn`, `.disabled_btn`
- Checkbox: `.custom-checkbox` (pure CSS with `<input type="checkbox">`)
- Radio: `.custom-radio` (pure CSS with `<input type="radio">`)
- Dropdown: `<custom-dropdown>`
- Scrollbar: `<custom-scrollbar>`
- Banner: `.banner`, `.neutral_banner`, `.information_banner`, `.important_banner`
- Badge: `.badge`, `.green_badge`, `.blue_badge`, `.yellow_badge`, `.red_badge`
- Divider: `<divider>`, `<divider-box>`, `<line>`, `<vertical-line>`
- Article: `<article_block>`, `<article_title>`, `<article_detail>`, etc.
- Header: `<header>`
- Loading: `.loading_mask`
- Link Block: `link-block`
- Modal: `modal`, `modal_area`
- Pop: `.pop`, `.pop_area`
- Slider: `.slider`, `.slider_slider`
- Switch: `.switch`, `.normal_switch`
- Tag: `.tag`, `.green_tag`, `.blue_tag`, `.yellow_tag`, `.red_tag`
- Text Field: `.input`, `text-field`

## Usage

```scss
@use '@ningze/paraore-ui';
```

```html
<link rel="stylesheet" href="dist/paraore-ui.css">
```

## Publish

```bash
npm run publish:npm
```

## Links

- GitHub: https://github.com/Spectrollay/OreUI
- npm: https://www.npmjs.com/package/@ningze/paraore-ui
