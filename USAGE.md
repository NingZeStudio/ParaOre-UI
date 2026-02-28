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

## Components

### Buttons
```html
<button class="btn normal_btn">Normal</button>
<button class="btn green_btn">Confirm</button>
<button class="btn red_btn">Cancel</button>
<button class="btn disabled_btn" disabled>Disabled</button>

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
```

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
    <div class="header_item header_item_left header_item_blank"></div>
    <div class="header_logo">
        <div class="header_title">Title</div>
    </div>
    <div class="header_item header_item_right">
        <img class="header_right_icon" src="icon.png" alt=""/>
    </div>
</header>
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
npm run build
npm run build:dev
npm run watch
```

## Publish

```bash
npm run publish:npm
```
