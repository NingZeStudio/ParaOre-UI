// ParaOre-UI Bundle
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// typescript/load.ts
function hideMask() {
  const loadingMask = document.getElementById("loading_mask");
  if (!loadingMask) return;
  setTimeout(() => {
    loadingMask.style.opacity = "0";
    setTimeout(() => {
      loadingMask.style.display = "none";
    }, 800);
  }, 1200);
}
__name(hideMask, "hideMask");
var count = 6;
var secondInterval = setInterval(() => {
  count--;
  if (count <= 0) {
    clearInterval(secondInterval);
    hideMask();
  }
}, 1e3);
document.addEventListener("DOMContentLoaded", () => {
  hideMask();
});

// typescript/public_script.ts
var currentURL = window.location.href;
var currentPagePath = window.location.pathname;
var hostPath = window.location.origin;
var parts = currentPagePath.split("/").filter(Boolean);
var slashCount = (currentPagePath.match(/\//g) || []).length;
if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
  document.body.classList.add("no-dark-mode");
}
document.addEventListener("DOMContentLoaded", () => {
  const mainScrollView = document.querySelector(".main_scroll_view.with_sidebar");
  if (mainScrollView) {
    window.addEventListener("resize", () => {
      mainScrollView.classList.add("animate");
    });
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const headerLogo = document.querySelector(".header_logo");
  if (headerLogo) {
    headerLogo.addEventListener("click", () => scrollToTop());
  }
});
var isNavigating = false;
function ifNavigating(way, url) {
  if (isNavigating) return;
  isNavigating = true;
  switch (way) {
    case "direct":
      window.location.href = url;
      break;
    case "open":
      setTimeout(() => {
        window.open(url);
        setTimeout(() => {
          isNavigating = false;
        }, 100);
      }, 100);
      break;
    case "jump":
      setTimeout(() => {
        window.location.href = url;
        setTimeout(() => {
          isNavigating = false;
        }, 100);
      }, 600);
      break;
  }
}
__name(ifNavigating, "ifNavigating");
function openLink(url) {
  ifNavigating("open", url);
}
__name(openLink, "openLink");
function launchApplication(deeplink) {
  window.location.assign(deeplink);
}
__name(launchApplication, "launchApplication");
function scrollToTop() {
  if (window.mainScrollContainer) {
    window.mainScrollContainer.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }
}
__name(scrollToTop, "scrollToTop");
function toTop() {
  if (window.mainScrollContainer) {
    window.mainScrollContainer.scrollTo({
      top: 0,
      behavior: "instant"
    });
  }
}
__name(toTop, "toTop");

// typescript/components/scroll.ts
function throttle(func, delay) {
  let lastCall = 0;
  return ((...args) => {
    const now = (/* @__PURE__ */ new Date()).getTime();
    if (now - lastCall < delay) return;
    lastCall = now;
    return func(...args);
  });
}
__name(throttle, "throttle");
function showScroll(customScrollbar) {
  if (customScrollbar._scrollHideTimeout) {
    clearTimeout(customScrollbar._scrollHideTimeout);
  }
  customScrollbar.style.opacity = "1";
  customScrollbar._scrollHideTimeout = window.setTimeout(() => {
    customScrollbar.style.opacity = "0";
  }, 3e3);
}
__name(showScroll, "showScroll");
function updateThumb(thumb, container, content, customScrollbar) {
  const scrollHeight = content.scrollHeight;
  const containerHeight = container.getBoundingClientRect().height;
  if (Math.round(scrollHeight) <= Math.round(containerHeight)) {
    customScrollbar.style.display = "none";
    return;
  } else {
    customScrollbar.style.display = "block";
  }
  const thumbHeight = Math.max(containerHeight / scrollHeight * containerHeight, 35);
  const maxContentScroll = scrollHeight - containerHeight;
  const currentScrollTop = Math.round(container.scrollTop);
  let thumbPosition, thumbTrackSpace;
  if (content.classList.contains("main_with_tab_bar")) {
    customScrollbar.style.top = "100px";
  }
  if (customScrollbar.classList.contains("primary_custom_scrollbar")) {
    thumbTrackSpace = containerHeight - (thumbHeight + 4);
  } else {
    thumbTrackSpace = containerHeight - thumbHeight;
  }
  if (maxContentScroll > 0 && thumbTrackSpace > 0) {
    thumbPosition = currentScrollTop / maxContentScroll * thumbTrackSpace;
    thumbPosition = Math.max(0, Math.min(thumbPosition, thumbTrackSpace));
  } else {
    thumbPosition = 0;
  }
  thumb.style.height = `${thumbHeight}px`;
  thumb.style.top = `${thumbPosition}px`;
  customScrollbar.style.height = `${containerHeight}px`;
}
__name(updateThumb, "updateThumb");
function handleScrollbarClick(e, isDragging, customScrollbar, thumb, container, content) {
  if (isDragging || customScrollbar.classList.contains("secondary_custom_scrollbar")) return;
  const { top: scrollbarClientRectTop, height: scrollbarActualHeight } = customScrollbar.getBoundingClientRect();
  const clickClientY = e.clientY;
  const clickPositionInScrollbar = clickClientY - scrollbarClientRectTop;
  const thumbVisualHeight = thumb.offsetHeight;
  const containerVisibleHeight = container.getBoundingClientRect().height;
  const contentScrollHeight = content.scrollHeight;
  const maxContentScroll = contentScrollHeight - containerVisibleHeight;
  if (maxContentScroll <= 0) return;
  const thumbCurrentOffsetTop = thumb.offsetTop;
  if (clickPositionInScrollbar < thumbCurrentOffsetTop || clickPositionInScrollbar > thumbCurrentOffsetTop + thumbVisualHeight) {
    const scrollbarTrackEffectiveHeight = scrollbarActualHeight - (thumbVisualHeight + 4);
    if (scrollbarTrackEffectiveHeight <= 0) return;
    let targetThumbTop = clickPositionInScrollbar - thumbVisualHeight / 2;
    targetThumbTop = Math.max(0, Math.min(targetThumbTop, scrollbarTrackEffectiveHeight));
    const newScrollTop = targetThumbTop / scrollbarTrackEffectiveHeight * maxContentScroll;
    container.scrollTop = Math.round(newScrollTop);
  }
}
__name(handleScrollbarClick, "handleScrollbarClick");
function handleScroll(customScrollbar, customThumb, container, content) {
  if (!customScrollbar || !customThumb) return;
  showScroll(customScrollbar);
  requestAnimationFrame(() => {
    updateThumb(customThumb, container, content, customScrollbar);
  });
}
__name(handleScroll, "handleScroll");
function handlePointerMove(e, dragState, thumb, container, content, customScrollbar) {
  if (!dragState.isDragging || customScrollbar.classList.contains("secondary_custom_scrollbar")) return;
  const currentY = "clientY" in e ? e.clientY : e.touches[0].clientY;
  const deltaY = currentY - dragState.startY;
  const containerHeight = container.getBoundingClientRect().height;
  const thumbHeight = thumb.offsetHeight;
  const maxThumbTop = containerHeight - thumbHeight;
  const newTop = Math.min(Math.max(dragState.initialThumbTop + deltaY, 0), maxThumbTop);
  const maxScrollTop = content.scrollHeight - containerHeight;
  container.scrollTo({
    top: newTop / maxThumbTop * maxScrollTop,
    behavior: "instant"
  });
  updateThumb(thumb, container, content, customScrollbar);
}
__name(handlePointerMove, "handlePointerMove");
function handlePointerDown(e, customThumb, container, content, dragState, customScrollbar) {
  dragState.isDragging = true;
  dragState.startY = "clientY" in e ? e.clientY : e.touches[0].clientY;
  dragState.initialThumbTop = customThumb.getBoundingClientRect().top - container.getBoundingClientRect().top;
  const handlePointerMoveBound = /* @__PURE__ */ __name((ev) => handlePointerMove(ev, dragState, customThumb, container, content, customScrollbar), "handlePointerMoveBound");
  document.addEventListener("pointermove", handlePointerMoveBound);
  document.addEventListener("touchmove", handlePointerMoveBound);
  const handlePointerUp = /* @__PURE__ */ __name(() => {
    dragState.isDragging = false;
    document.removeEventListener("pointermove", handlePointerMoveBound);
    document.removeEventListener("touchmove", handlePointerMoveBound);
  }, "handlePointerUp");
  document.addEventListener("pointerup", handlePointerUp, { once: true });
  document.addEventListener("touchend", handlePointerUp, { once: true });
}
__name(handlePointerDown, "handlePointerDown");
function bindScrollEvents(container, content, customScrollbar, customThumb) {
  const dragState = { isDragging: false, startY: 0, initialThumbTop: 0 };
  const throttledUpdateAndShowScroll = throttle(() => {
    handleScroll(customScrollbar, customThumb, container, content);
  }, 1);
  const throttledShowOnly = throttle(() => {
    showScroll(customScrollbar);
  }, 100);
  customScrollbar.addEventListener("wheel", (e) => {
    const delta = e.deltaY > 0 ? 10 : -10;
    container.scrollTop += delta;
    throttledUpdateAndShowScroll();
    e.preventDefault();
  });
  document.addEventListener("mousemove", throttledShowOnly);
  document.addEventListener("touchmove", throttledShowOnly);
  container.addEventListener("scroll", throttledUpdateAndShowScroll);
  window.addEventListener("resize", throttledUpdateAndShowScroll);
  customThumb.addEventListener("pointerdown", (e) => handlePointerDown(e, customThumb, container, content, dragState, customScrollbar));
  customThumb.addEventListener("touchstart", (e) => handlePointerDown(e, customThumb, container, content, dragState, customScrollbar));
  customScrollbar.addEventListener("click", (e) => handleScrollbarClick(e, dragState.isDragging, customScrollbar, customThumb, container, content));
  window.addEventListener("load", () => setTimeout(throttledUpdateAndShowScroll, 10));
}
__name(bindScrollEvents, "bindScrollEvents");
function initializeScrollContainers() {
  const containers = document.querySelectorAll(".primary_scroll_container, .secondary_scroll_container");
  containers.forEach((container) => {
    const contentElement = container.querySelector(".scroll_container, .sidebar_content");
    const scrollViewElement = contentElement?.closest("scroll-view");
    const customScrollbarElement = scrollViewElement?.querySelector("custom-scrollbar");
    const customThumbElement = customScrollbarElement?.querySelector("custom-scrollbar-thumb");
    if (contentElement && customScrollbarElement && customThumbElement) {
      bindScrollEvents(container, contentElement, customScrollbarElement, customThumbElement);
      const ScrollHandlerForResize = createHandleScroll(customScrollbarElement, customThumbElement, container, contentElement);
      const throttledScrollHandler = throttle(ScrollHandlerForResize, 1);
      const observer = new ResizeObserver(() => {
        throttledScrollHandler();
      });
      observer.observe(container);
      observer.observe(contentElement);
    }
  });
}
__name(initializeScrollContainers, "initializeScrollContainers");
function createHandleScroll(customScrollbar, customThumb, container, content) {
  return () => {
    handleScroll(customScrollbar, customThumb, container, content);
  };
}
__name(createHandleScroll, "createHandleScroll");
document.addEventListener("DOMContentLoaded", () => {
  initializeScrollContainers();
});
var mainScrollContainer = document.querySelector(".primary_scroll_container");
function getMainHandleScroll() {
  const scrollView = document.querySelector(".scroll_container")?.closest("scroll-view");
  const scrollbar = scrollView?.querySelector("custom-scrollbar");
  const thumb = scrollView?.querySelector("custom-scrollbar-thumb");
  if (mainScrollContainer && scrollbar && thumb) {
    return throttle(createHandleScroll(scrollbar, thumb, mainScrollContainer, document.querySelector(".scroll_container")), 1);
  }
  return () => {
  };
}
__name(getMainHandleScroll, "getMainHandleScroll");
if (typeof window !== "undefined") {
  window.mainScrollContainer = mainScrollContainer;
  window.mainHandleScroll = getMainHandleScroll();
}

// typescript/types.ts
var rootPath = typeof window !== "undefined" ? "/" + (window.location.pathname.split("/").filter(Boolean).length > 0 ? window.location.pathname.split("/").filter(Boolean)[0] : "") : "";

// typescript/components/button.ts
var _CustomButton = class _CustomButton extends HTMLElement {
  constructor() {
    super();
    this.status = "normal";
    this.icon = "";
    this.render();
  }
  static get observedAttributes() {
    return ["data", "js", "text"];
  }
  attributeChangedCallback() {
    this.render();
    setTimeout(() => window.updateFocusableElements?.(), 10);
  }
  render() {
    const data = this.getAttribute("data") || "";
    const [type, status, size, id, isTip, tip, icon] = data.split("|").map((item) => item.trim());
    this.status = status || "normal";
    this.icon = icon || "";
    const ctype = type || "default";
    const csize = size || "middle";
    const cid = id || "";
    const cisTip = isTip === "true";
    const ctip = tip || "";
    const js = this.getAttribute("js") || "false";
    const text = this.getAttribute("text") || "";
    if (ctype === "default") {
      if (cisTip) {
        this.innerHTML = `
          <div class="btn_with_tooltip_cont">
            <button class="btn ${csize}_btn ${status}_btn" id="${cid}">${text}</button>
            <div class="btn_tooltip">${ctip}</div>
            <img alt="" class="tip_icon" src="${rootPath}/images/${icon}.png"/>
          </div>
        `;
      } else {
        this.innerHTML = `<button class="btn ${csize}_btn ${status}_btn" id="${cid}">${text}</button>`;
      }
    } else {
      this.classList.add(ctype + "_custom_btn");
      this.innerHTML = `<button class="btn ${status}_btn ${ctype}_btn" id="${cid}">${text}</button>`;
    }
    const button = this.querySelector("button");
    if (button) {
      button.addEventListener("click", () => {
        const buttonClickEvent = new CustomEvent("button-click", {
          bubbles: true,
          cancelable: true
        });
        this.dispatchEvent(buttonClickEvent);
      });
      if (this.status !== "disabled" && js !== "false") {
        button.addEventListener("click", () => {
          try {
            eval(js);
          } catch {
          }
        });
      }
    }
  }
};
__name(_CustomButton, "CustomButton");
var CustomButton = _CustomButton;
customElements.define("custom-button", CustomButton);

// typescript/components/checkbox.ts
var _CustomCheckbox = class _CustomCheckbox extends HTMLElement {
  constructor() {
    super();
    this.beforeToggle = null;
    this.render();
    const checkbox = this.querySelector('input[type="checkbox"]');
    if (checkbox) {
      checkbox.addEventListener("change", () => this.toggleCheckbox());
    }
  }
  static get observedAttributes() {
    return ["status", "active"];
  }
  connectedCallback() {
    this.restoreState();
  }
  attributeChangedCallback() {
    this.render();
    setTimeout(() => window.updateFocusableElements?.(), 10);
  }
  render() {
    const active = this.getAttribute("active") || "off";
    const status2 = this.getAttribute("status") || "disabled";
    const isDisabled = status2 !== "enabled";
    const isOn = active === "on";
    this.innerHTML = `
      <label class="custom-checkbox-label">
        <div class="custom-checkbox ${isOn ? "on" : "off"} ${isDisabled ? "disabled" : "enabled"}">
          <input type="checkbox" ${isOn ? "checked" : ""} ${isDisabled ? "disabled" : ""}>
          <span class="checkmark"></span>
        </div>
      </label>
    `;
    const checkbox = this.querySelector('input[type="checkbox"]');
    if (checkbox) {
      checkbox.addEventListener("change", () => this.toggleCheckbox());
    }
  }
  shouldAllowToggle() {
    if (typeof this.beforeToggle === "function") {
      const allowed = this.beforeToggle(this);
      if (!allowed) {
        this.dispatchEvent(new CustomEvent("checkbox-toggle-blocked", {
          bubbles: true,
          detail: { checkboxId: this.id }
        }));
        return false;
      }
    }
    return true;
  }
  toggleCheckbox() {
    if (this.getAttribute("status") !== "enabled") return;
    if (!this.shouldAllowToggle()) return;
    const isChecked = this.getAttribute("active") === "on";
    const checkboxData = JSON.parse(localStorage.getItem(`(${rootPath}/)checkbox_value`) || "{}");
    if (isChecked) {
      this.setAttribute("active", "off");
      if (this.id === "neverShowIn15Days") {
        localStorage.removeItem(`(${rootPath}/)neverShowIn15Days`);
      } else {
        checkboxData[this.id] = "off";
      }
    } else {
      this.setAttribute("active", "on");
      if (this.id === "neverShowIn15Days") {
        localStorage.setItem(`(${rootPath}/)neverShowIn15Days`, Date.now().toString());
      } else {
        checkboxData[this.id] = "on";
      }
    }
    localStorage.setItem(`(${rootPath}/)checkbox_value`, JSON.stringify(checkboxData));
    this.render();
    const checkboxClickEvent = new CustomEvent("checkbox-click", {
      bubbles: true,
      cancelable: true
    });
    this.dispatchEvent(checkboxClickEvent);
  }
  restoreState() {
    const checkboxData = JSON.parse(localStorage.getItem(`(${rootPath}/)checkbox_value`) || "{}");
    const state = checkboxData[this.id];
    if (state) {
      if (this.id === "neverShowIn15Days") return;
      this.setAttribute("active", state);
    }
  }
};
__name(_CustomCheckbox, "CustomCheckbox");
var CustomCheckbox = _CustomCheckbox;
customElements.define("custom-checkbox", CustomCheckbox);

// typescript/components/dropdown.ts
var _CustomDropdown = class _CustomDropdown extends HTMLElement {
  constructor() {
    super();
    this.margin = 6;
    this.optionsData = [];
    this.selectedValue = null;
    this.label = null;
    this.arrow = null;
    this.dropdownOptions = null;
    this.storageKey = "";
    this.optionsData = JSON.parse(this.getAttribute("data-option") || "[]");
    this.selectedValue = this.getAttribute("data-selected") || null;
    this.label = document.createElement("div");
    this.label.classList.add("dropdown_label");
    this.appendChild(this.label);
    this.arrow = document.createElement("img");
    this.arrow.classList.add("dropdown_arrow");
    this.arrow.src = rootPath + "/images/arrowDown.png";
    this.appendChild(this.arrow);
    this.dropdownOptions = document.createElement("div");
    this.dropdownOptions.classList.add("dropdown_options");
    this.appendChild(this.dropdownOptions);
    this.optionsData.forEach((labelText, index) => {
      const option = document.createElement("div");
      option.classList.add("dropdown_option");
      option.setAttribute("data-value", (index + 1).toString());
      option.innerHTML = `${labelText} <img alt="" class="dropdown_checkmark" src="${rootPath}/images/check_white.png">`;
      option.addEventListener("click", () => this.selectOption(option));
      this.dropdownOptions?.appendChild(option);
    });
    this.storageKey = `(${rootPath}/)dropdown_value`;
    const storedData = this.getStoredDropdownData();
    this.selectedValue = storedData[this.id] || this.selectedValue;
    this.addEventListener("click", () => this.toggleOptions());
    this.updateLabel();
    this.renderOptions();
    document.addEventListener("mousedown", (e) => this.handleOutsideClick(e));
    document.addEventListener("touchstart", (e) => this.handleOutsideClick(e));
  }
  static get observedAttributes() {
    return ["status"];
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "status" && this.label && this.arrow) {
      this.label.classList.toggle("disabled_dropdown", newValue === "disabled");
      this.arrow.classList.toggle("disabled_dropdown_arrow", newValue === "disabled");
    }
    setTimeout(() => window.updateFocusableElements?.(), 10);
  }
  getStoredDropdownData() {
    const storedData = localStorage.getItem(this.storageKey);
    return storedData ? JSON.parse(storedData) : {};
  }
  saveDropdownData(data2) {
    localStorage.setItem(this.storageKey, JSON.stringify(data2));
  }
  toggleOptions() {
    if (this.getAttribute("status") === "disabled" || !this.dropdownOptions) return;
    const isVisible = this.dropdownOptions.style.display === "block";
    this.dropdownOptions.style.display = isVisible ? "none" : "block";
    const dropdownContainer = this.closest(".dropdown_container");
    if (dropdownContainer && this.label) {
      dropdownContainer.style.height = isVisible ? `${this.label.offsetHeight + this.margin}px` : `${this.dropdownOptions?.scrollHeight + this.margin}px`;
    }
    if (window.mainHandleScroll) window.mainHandleScroll();
  }
  selectOption(option) {
    if (this.getAttribute("status") === "disabled") return;
    const value = option.getAttribute("data-value");
    if (this.selectedValue !== value) {
      this.selectedValue = value;
      this.updateLabel();
      this.renderOptions();
      const storedData = this.getStoredDropdownData();
      storedData[this.id] = this.selectedValue || "";
      this.saveDropdownData(storedData);
    }
  }
  updateLabel() {
    if (!this.label) return;
    const selectedIndex = this.selectedValue ? parseInt(this.selectedValue) - 1 : 0;
    this.label.innerHTML = this.optionsData[selectedIndex] || this.getAttribute("unselected-text") || "\u9009\u62E9\u4E00\u4E2A\u9009\u9879";
    const dropdownValueChangeEvent = new CustomEvent("dropdown-value-change", {
      bubbles: true,
      cancelable: true,
      detail: { value: this.selectedValue }
    });
    this.dispatchEvent(dropdownValueChangeEvent);
  }
  renderOptions() {
    if (!this.dropdownOptions) return;
    this.dropdownOptions.querySelectorAll(".dropdown_option").forEach((option) => {
      const isSelected = option.getAttribute("data-value") === this.selectedValue;
      option.classList.toggle("selected", isSelected);
      const checkmark = option.querySelector(".dropdown_checkmark");
      if (checkmark) {
        checkmark.style.display = isSelected ? "block" : "none";
      }
    });
  }
  handleOutsideClick(e) {
    const isVisible = this.dropdownOptions?.style.display === "block";
    if (!isVisible) return;
    if (!this.contains(e.target)) {
      if (this.dropdownOptions) {
        this.dropdownOptions.style.display = "none";
      }
      const dropdownContainer = this.closest(".dropdown_container");
      if (dropdownContainer && this.label) {
        dropdownContainer.style.height = `${this.label.offsetHeight + this.margin}px`;
      }
      if (window.mainHandleScroll) window.mainHandleScroll();
    }
  }
};
__name(_CustomDropdown, "CustomDropdown");
var CustomDropdown = _CustomDropdown;
customElements.define("custom-dropdown", CustomDropdown);

// typescript/components/modal.ts
function showModal(modalId) {
  const overlay = document.getElementById("overlay_" + modalId);
  const frame = document.getElementById(modalId);
  if (!overlay || !frame) return;
  overlay.style.display = "block";
  frame.style.display = "block";
  frame.focus();
}
__name(showModal, "showModal");
function hideModal(source) {
  let frameId = null;
  if (source instanceof HTMLElement) {
    let currentElement = source.parentElement;
    while (currentElement) {
      if (currentElement.tagName?.toLowerCase() === "modal_area") {
        frameId = currentElement.id;
        break;
      }
      currentElement = currentElement.parentElement;
    }
    if (!frameId) return;
  } else if (typeof source === "string") {
    frameId = source;
  } else {
    return;
  }
  const overlay = document.getElementById("overlay_" + frameId);
  const frame = document.getElementById(frameId);
  if (!overlay || !frame) return;
  overlay.style.display = "none";
  frame.style.display = "none";
}
__name(hideModal, "hideModal");

// typescript/components/slider.ts
var _CustomSlider = class _CustomSlider extends HTMLElement {
  constructor() {
    super();
    this.isFirstRender = true;
  }
  static get observedAttributes() {
    return ["status"];
  }
  connectedCallback() {
    if (this.isFirstRender) {
      this.render();
      this.isFirstRender = false;
    }
  }
  attributeChangedCallback() {
    if (!this.isFirstRender) {
      this.render();
      setTimeout(() => window.updateFocusableElements?.(), 10);
    }
  }
  render() {
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
    const content = this.querySelector(".slider_content");
    const tooltip = this.querySelector(".slider_tooltip");
    const slider = this.querySelector(".slider");
    const process = this.querySelector(".slider_process");
    const handle = this.querySelector(".slider_slider");
    const sliderData = JSON.parse(this.getAttribute("data-slider") || "{}");
    const minValue = sliderData.minValue || 0;
    const maxValue = sliderData.maxValue || 100;
    const segments = sliderData.segments || 10;
    const initialValue = sliderData.initialValue || minValue;
    const showSegments = this.getAttribute("data-show-segments");
    const customSegments = this.getAttribute("data-custom-segments") === "true";
    const segmentValues = customSegments ? JSON.parse(this.getAttribute("data-segment-values") || "[]") : [];
    const isDisabled = this.getAttribute("status") === "disabled";
    const type2 = this.getAttribute("type") || "range";
    const sliderId = this.id;
    let currentValue = initialValue;
    let isDragging = false;
    const storedIndex = getSliderValue(sliderId);
    if (storedIndex !== null) {
      currentValue = storedIndex;
    }
    function formatIntegerValue(value) {
      return value.toFixed(2).replace(/\.?0+$/, "");
    }
    __name(formatIntegerValue, "formatIntegerValue");
    function formatDecimalValue(value) {
      return value.toFixed(2);
    }
    __name(formatDecimalValue, "formatDecimalValue");
    function updateHandle(position) {
      handle.style.left = position + "%";
      process.style.width = position + "%";
    }
    __name(updateHandle, "updateHandle");
    function updateTooltip(position) {
      if (type2 === "set") {
        const segmentIndex = Math.round(position / (100 / segments));
        const segmentValue = customSegments ? segmentValues[segmentIndex] : minValue + segmentIndex * (maxValue - minValue) / segments;
        tooltip.textContent = customSegments ? segmentValue.toString() : formatIntegerValue(segmentValue);
      } else {
        if (position === 0 || position === 100) {
          tooltip.textContent = formatIntegerValue(calculateValue(position));
        } else {
          tooltip.textContent = formatDecimalValue(calculateValue(position));
        }
      }
    }
    __name(updateTooltip, "updateTooltip");
    function calculatePosition(value) {
      return (value - minValue) / (maxValue - minValue) * 100;
    }
    __name(calculatePosition, "calculatePosition");
    function calculateValue(position) {
      return position * (maxValue - minValue) / 100 + minValue;
    }
    __name(calculateValue, "calculateValue");
    function changeValue(position) {
      updateHandle(position);
      updateTooltip(position);
      saveSliderValue();
      const sliderValueChangeEvent = new CustomEvent("slider-value-change", {
        bubbles: true,
        cancelable: true
      });
      slider.dispatchEvent(sliderValueChangeEvent);
    }
    __name(changeValue, "changeValue");
    function setSliderValue(position) {
      currentValue = position * (maxValue - minValue) / 100 + minValue;
      changeValue(position);
    }
    __name(setSliderValue, "setSliderValue");
    function snapToSegment(position) {
      const segmentIndex = Math.round(position / (100 / segments));
      const segmentPosition = segmentIndex * (100 / segments);
      currentValue = minValue + segmentIndex * (maxValue - minValue) / segments;
      changeValue(segmentPosition);
    }
    __name(snapToSegment, "snapToSegment");
    function getSliderValue(id2) {
      const sliderStorage = JSON.parse(localStorage.getItem(`(${rootPath}/)slider_value`) || "{}");
      return sliderStorage[id2] !== void 0 ? sliderStorage[id2] : null;
    }
    __name(getSliderValue, "getSliderValue");
    function saveSliderValue() {
      const sliderStorage = JSON.parse(localStorage.getItem(`(${rootPath}/)slider_value`) || "{}");
      sliderStorage[sliderId] = currentValue;
      localStorage.setItem(`(${rootPath}/)slider_value`, JSON.stringify(sliderStorage));
    }
    __name(saveSliderValue, "saveSliderValue");
    updateHandle(calculatePosition(currentValue));
    updateTooltip(calculatePosition(currentValue));
    if (type2 === "range") {
      if (showSegments === null || showSegments === "true") {
        const minValueLabel = document.createElement("div");
        minValueLabel.classList.add("slider_value_info");
        minValueLabel.textContent = formatIntegerValue(minValue);
        minValueLabel.style.position = "absolute";
        minValueLabel.style.bottom = "-35px";
        slider.appendChild(minValueLabel);
        const minValueLabelWidth = minValueLabel.offsetWidth;
        minValueLabel.style.left = `calc(0% - ${minValueLabelWidth / 2}px)`;
        const maxValueLabel = document.createElement("div");
        maxValueLabel.classList.add("slider_value_info");
        maxValueLabel.textContent = formatIntegerValue(maxValue);
        maxValueLabel.style.position = "absolute";
        maxValueLabel.style.bottom = "-35px";
        slider.appendChild(maxValueLabel);
        const maxValueLabelWidth = maxValueLabel.offsetWidth;
        maxValueLabel.style.left = `calc(100% - ${maxValueLabelWidth / 2}px)`;
      }
    } else if (type2 === "set") {
      for (let i = 0; i <= segments; i++) {
        if (i > 0 && i < segments) {
          const segment = document.createElement("div");
          segment.classList.add("slider_segment");
          segment.style.left = `calc(${i / segments * 100}% - 1px)`;
          slider.appendChild(segment);
        }
        if (showSegments === "true") {
          const segmentValueLabel = document.createElement("div");
          const segmentValue = customSegments ? segmentValues[i] : minValue + i * (maxValue - minValue) / segments;
          segmentValueLabel.classList.add("slider_value_info");
          segmentValueLabel.textContent = customSegments ? segmentValue.toString() : formatIntegerValue(segmentValue);
          segmentValueLabel.style.position = "absolute";
          segmentValueLabel.style.bottom = "-35px";
          slider.appendChild(segmentValueLabel);
          const segmentValueLabelWidth = segmentValueLabel.offsetWidth;
          segmentValueLabel.style.left = `calc(${i / segments * 100}% - ${segmentValueLabelWidth / 2}px)`;
        }
      }
    }
    if (isDisabled) {
      handle.classList.add("disabled_slider");
      slider.classList.add("disabled_slider");
      return;
    }
    const startDrag = /* @__PURE__ */ __name((event) => {
      process.style.transition = "none";
      handle.style.transition = "none";
      isDragging = true;
      event.preventDefault();
      updatePosition(event);
    }, "startDrag");
    const stopDrag = /* @__PURE__ */ __name(() => {
      setTimeout(() => {
        isDragging = false;
      }, 0);
      process.style.transition = "width 100ms linear";
      handle.style.transition = "left 100ms linear";
    }, "stopDrag");
    const updatePosition = /* @__PURE__ */ __name((event) => {
      setTimeout(() => {
        if (!isDragging) return;
        const position = currentPosition(event);
        setSliderValue(position);
      }, 0);
    }, "updatePosition");
    const currentPosition = /* @__PURE__ */ __name((event) => {
      const rect = slider.getBoundingClientRect();
      let position;
      if ("touches" in event && event.touches && event.touches.length > 0) {
        position = (event.touches[0].clientX - rect.left) / rect.width * 100;
      } else if ("changedTouches" in event && event.changedTouches && event.changedTouches.length > 0) {
        position = (event.changedTouches[0].clientX - rect.left) / rect.width * 100;
      } else if ("clientX" in event) {
        position = (event.clientX - rect.left) / rect.width * 100;
      } else {
        position = 0;
      }
      return Math.max(0, Math.min(position, 100));
    }, "currentPosition");
    handle.addEventListener("mousedown", startDrag);
    handle.addEventListener("touchstart", startDrag);
    window.addEventListener("mousemove", updatePosition);
    window.addEventListener("touchmove", updatePosition);
    window.addEventListener("mouseup", stopDrag);
    window.addEventListener("touchend", stopDrag);
    content.addEventListener("click", (event) => {
      if (isDragging) return;
      const position = currentPosition(event);
      if (type2 === "set") {
        snapToSegment(position);
      } else {
        setSliderValue(position);
      }
    });
    handle.addEventListener("keydown", (event) => {
      const step = sliderData.step || 1;
      if (event.key === "ArrowLeft" || event.key === "ArrowUp" || event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        if (type2 === "set") {
          let segmentIndex = Math.round((currentValue - minValue) / (maxValue - minValue) * segments);
          if (event.key === "ArrowLeft") segmentIndex = Math.max(0, segmentIndex - 1);
          else if (event.key === "ArrowUp") segmentIndex = segments;
          else if (event.key === "ArrowRight") segmentIndex = Math.min(segments, segmentIndex + 1);
          else if (event.key === "ArrowDown") segmentIndex = 0;
          currentValue = minValue + segmentIndex * (maxValue - minValue) / segments;
          const newPosition = segmentIndex / segments * 100;
          snapToSegment(newPosition);
        } else {
          if (event.key === "ArrowLeft") currentValue = Math.max(minValue, currentValue - step);
          else if (event.key === "ArrowUp") currentValue = maxValue;
          else if (event.key === "ArrowRight") currentValue = Math.min(maxValue, currentValue + step);
          else if (event.key === "ArrowDown") currentValue = minValue;
          const newPosition = calculatePosition(currentValue);
          setSliderValue(newPosition);
        }
      }
    });
  }
};
__name(_CustomSlider, "CustomSlider");
var CustomSlider = _CustomSlider;
customElements.define("custom-slider", CustomSlider);

// typescript/components/switch.ts
var _CustomSwitch = class _CustomSwitch extends HTMLElement {
  constructor() {
    super();
    this.beforeToggle = null;
    this.isSwitchOn = false;
    this.isSwitchDisabled = false;
    this.startX = 0;
    this.isDragging = false;
    this.render();
  }
  static get observedAttributes() {
    return ["active", "status"];
  }
  attributeChangedCallback() {
    this.updateRender();
    setTimeout(() => window.updateFocusableElements?.(), 10);
  }
  render() {
    const status2 = this.getAttribute("status") || "disabled";
    this.isSwitchDisabled = status2 !== "enabled";
    this.isSwitchOn = this.getSwitchValue() === "on";
    this.innerHTML = `
      <div class="switch_content">
        <div class="switch ${this.isSwitchOn ? "on" : "off"} ${this.isSwitchDisabled ? "disabled_switch" : "normal_switch"}">
          <div class="switch_style left"><img alt="" src="${rootPath}/images/switch_on.png"/></div>
          <div class="switch_style right"><img alt="" src="${rootPath}/images/switch_off.png"/></div>
          <div class="switch_slider can_click"></div>
        </div>
      </div>
    `;
    this.bindEvents();
  }
  updateRender() {
    this.isSwitchOn = this.getSwitchValue() === "on";
    this.isSwitchDisabled = this.getAttribute("status") !== "enabled";
    const switchElement = this.querySelector(".switch");
    if (switchElement) {
      switchElement.classList.toggle("on", this.isSwitchOn);
      switchElement.classList.toggle("off", !this.isSwitchOn);
      switchElement.classList.toggle("disabled_switch", this.isSwitchDisabled);
      switchElement.classList.toggle("normal_switch", !this.isSwitchDisabled);
    }
  }
  shouldAllowToggle() {
    if (typeof this.beforeToggle === "function") {
      const allowed = this.beforeToggle(this);
      if (!allowed) {
        this.dispatchEvent(new CustomEvent("switch-toggle-blocked", {
          bubbles: true,
          detail: { switchId: this.id }
        }));
        return false;
      }
    }
    return true;
  }
  bindEvents() {
    const switchElement = this.querySelector(".switch");
    const switchSlider = this.querySelector(".switch_slider");
    if (!this.isSwitchDisabled && switchElement && switchSlider) {
      const handlePointerDown2 = /* @__PURE__ */ __name((e) => {
        this.isDragging = false;
        switchSlider.classList.add("active");
        this.startX = "clientX" in e ? e.clientX : e.touches[0].clientX;
      }, "handlePointerDown");
      const handlePointerMove2 = /* @__PURE__ */ __name((e) => {
        e.preventDefault();
        const currentX = "clientX" in e ? e.clientX : e.changedTouches[0].clientX;
        const distanceMoved = currentX - this.startX;
        this.isDragging = distanceMoved > 10 || distanceMoved < -10;
      }, "handlePointerMove");
      const handlePointerUp = /* @__PURE__ */ __name((e) => {
        if (this.isDragging) {
          const currentX = "clientX" in e ? e.clientX : e.changedTouches[0].clientX;
          const distanceMoved = currentX - this.startX;
          const newState = distanceMoved > 10 ? true : distanceMoved < -10 ? false : this.isSwitchOn;
          if (newState !== this.isSwitchOn) {
            if (!this.shouldAllowToggle()) {
              this.isDragging = false;
              switchSlider.classList.remove("active");
              return;
            }
            this.isSwitchOn = newState;
            this.updateSwitchState(this.isSwitchOn);
          }
        }
        setTimeout(() => {
          this.isDragging = false;
          switchSlider.classList.remove("active");
        }, 0);
      }, "handlePointerUp");
      const handleClick = /* @__PURE__ */ __name(() => {
        if (!this.isDragging) {
          if (!this.shouldAllowToggle()) return;
          this.isSwitchOn = !this.isSwitchOn;
          this.updateSwitchState(this.isSwitchOn);
        }
      }, "handleClick");
      const parentElement = this.parentElement?.parentElement;
      if (parentElement) {
        parentElement.addEventListener("click", handleClick);
      }
      switchElement.addEventListener("mousedown", handlePointerDown2);
      switchElement.addEventListener("touchstart", handlePointerDown2);
      switchElement.addEventListener("mousemove", handlePointerMove2);
      switchElement.addEventListener("touchmove", handlePointerMove2);
      document.addEventListener("mouseup", handlePointerUp);
      document.addEventListener("touchend", handlePointerUp);
    }
  }
  updateSwitchState(isOn) {
    this.setAttribute("active", isOn ? "on" : "off");
    const switchElement = this.querySelector(".switch");
    const switchSlider = this.querySelector(".switch_slider");
    switchElement?.classList.toggle("on", isOn);
    switchElement?.classList.toggle("off", !isOn);
    const switchValues = JSON.parse(localStorage.getItem(`(${rootPath}/)switch_value`) || "{}");
    switchValues[this.id] = isOn ? "on" : "off";
    localStorage.setItem(`(${rootPath}/)switch_value`, JSON.stringify(switchValues));
    if (switchSlider) {
      if (isOn) {
        switchSlider.classList.add("switch_bounce_left");
        switchSlider.classList.remove("switch_bounce_right");
      } else {
        switchSlider.classList.add("switch_bounce_right");
        switchSlider.classList.remove("switch_bounce_left");
      }
    }
    this.updateRender();
    const switchValueChangeEvent = new CustomEvent("switch-value-change", {
      bubbles: true,
      cancelable: true
    });
    this.dispatchEvent(switchValueChangeEvent);
  }
  getSwitchValue() {
    const switchValues = JSON.parse(localStorage.getItem(`(${rootPath}/)switch_value`) || "{}");
    if (this.id in switchValues) {
      return switchValues[this.id];
    }
    return this.getAttribute("active") || "off";
  }
};
__name(_CustomSwitch, "CustomSwitch");
var CustomSwitch = _CustomSwitch;
customElements.define("custom-switch", CustomSwitch);

// typescript/components/text-field.ts
var _TextField = class _TextField extends HTMLElement {
  constructor() {
    super();
    this.inputField = null;
    this.hint = null;
    this.isComposing = false;
    const type2 = this.getAttribute("type") || "text";
    const isSingleLine = this.getAttribute("single-line") || "true";
    const maxLength = parseInt(this.getAttribute("max-length") || "0") || null;
    this.inputField = document.createElement("textarea");
    this.inputField.classList.add("input");
    this.inputField.rows = 1;
    this.appendChild(this.inputField);
    this.hint = document.createElement("div");
    this.hint.classList.add("hint");
    this.hint.textContent = this.getAttribute("hint") || "";
    this.appendChild(this.hint);
    if (isSingleLine === "true") {
      this.inputField.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
        }
      });
    }
    this.inputField.addEventListener("focus", () => {
      if (this.hint) this.hint.style.opacity = "0";
    });
    this.inputField.addEventListener("blur", () => {
      this.updateHint();
    });
    this.inputField.addEventListener("compositionstart", () => {
      this.isComposing = true;
    });
    this.inputField.addEventListener("compositionend", () => {
      this.isComposing = false;
      setTimeout(() => {
        this.validateLength(maxLength);
        const inputValue = this.inputField?.value || "";
        const { isValid, filtered } = this.isValidAndFilterInput(inputValue, type2);
        if (!isValid && this.inputField) {
          this.inputField.value = filtered;
          const textfieldInvalidInputEvent = new CustomEvent("textfield-invalid-input", {
            bubbles: true,
            cancelable: true
          });
          this.dispatchEvent(textfieldInvalidInputEvent);
          return;
        }
        this.saveTextFieldValue();
      }, 0);
    });
    this.inputField.addEventListener("beforeinput", (e) => {
      if (!this.isComposing && e.data) {
        const { isValid } = this.isValidAndFilterInput(e.data, type2);
        if (!isValid) {
          e.preventDefault();
          const textfieldInvalidInputEvent = new CustomEvent("textfield-invalid-input", {
            bubbles: true,
            cancelable: true
          });
          this.dispatchEvent(textfieldInvalidInputEvent);
        }
      }
    });
    this.inputField.addEventListener("input", () => {
      if (this.isComposing) return;
      this.validateLength(maxLength);
      this.updateTextField();
      if (this.inputField) {
        const { isValid } = this.isValidAndFilterInput(this.inputField.value, type2);
        if (isValid) {
          this.saveTextFieldValue();
          const textfieldValueChangeEvent = new CustomEvent("textfield-value-change", {
            bubbles: true,
            cancelable: true
          });
          this.dispatchEvent(textfieldValueChangeEvent);
        }
      }
    });
  }
  static get observedAttributes() {
    return ["status"];
  }
  connectedCallback() {
    if (this.parentNode && "id" in this.parentNode && this.parentNode.id) {
      this.classList.add(this.parentNode.id);
    }
    this.getTextFieldValue();
    requestAnimationFrame(() => {
      this.updateTextField();
    });
    if (this.hasAttribute("status")) {
      this.classList.toggle("disabled_text_field", this.getAttribute("status") === "disabled");
      if (this.inputField) {
        this.inputField.disabled = this.getAttribute("status") === "disabled";
      }
    }
  }
  validateLength(maxLength) {
    if (!this.inputField) return;
    const content = this.inputField.value;
    const length = content.length;
    if (maxLength !== null && length > maxLength) {
      this.inputField.value = content.substring(0, maxLength);
    }
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "status") {
      const isDisabled = newValue === "disabled";
      this.classList.toggle("disabled_text_field", isDisabled);
      if (this.inputField) {
        this.inputField.disabled = isDisabled;
        this.updateHint();
      }
    }
    setTimeout(() => window.updateFocusableElements?.(), 10);
  }
  updateTextField() {
    this.updateHint();
    this.autoResize();
  }
  updateHint() {
    if (!this.inputField || !this.hint) return;
    const content = this.inputField.value;
    const isFocused = document.activeElement?.isSameNode(this.inputField);
    const isDisabled = this.inputField.disabled;
    if (content.length === 0 && (!isFocused || isDisabled)) {
      this.hint.style.opacity = "1";
    } else {
      this.hint.style.opacity = "0";
    }
  }
  autoResize() {
    if (!this.inputField) return;
    this.inputField.style.height = "auto";
    const scrollH = this.inputField.scrollHeight;
    const computedStyle = getComputedStyle(this.inputField);
    let cssMinHeight = 0;
    if (computedStyle.minHeight && computedStyle.minHeight.endsWith("px")) {
      cssMinHeight = parseFloat(computedStyle.minHeight);
    }
    const effectiveMinHeight = Math.max(cssMinHeight, 40);
    const targetHeight = Math.max(scrollH, effectiveMinHeight);
    this.inputField.style.height = targetHeight + "px";
    this.style.height = targetHeight + "px";
    getMainHandleScroll();
  }
  isValidAndFilterInput(input, type2) {
    if (type2 === "text" || type2 === "all" || !type2) {
      return { isValid: true, filtered: input === null ? "" : input };
    }
    if (!input && input !== "") {
      return { isValid: true, filtered: input === null ? "" : input };
    }
    let regex;
    let filteredInput;
    switch (type2) {
      case "number":
        regex = /^[0-9]*$/;
        filteredInput = input.replace(/[^0-9]/g, "");
        break;
      case "letter":
        regex = /^[a-zA-Z]*$/;
        filteredInput = input.replace(/[^a-zA-Z]/g, "");
        break;
      case "operator":
        regex = /^[`!@#$%^&*()\-_=+[\]{};':"\\|,.<>/?~]*$/;
        filteredInput = input.replace(/[^`!@#$%^&*()\-_=+[\]{};':"\\|,.<>/?~]/g, "");
        break;
      case "base":
        regex = /^[0-9a-zA-Z `!@#$%^&*()\-_=+[\]{};':"\\|,.<>/?~]*$/;
        filteredInput = input.replace(/[^0-9a-zA-Z `!@#$%^&*()\-_=+[\]{};':"\\|,.<>/?~]/g, "");
        break;
      case "none":
        return { isValid: input.length === 0, filtered: "" };
      default:
        return { isValid: true, filtered: input };
    }
    return { isValid: regex.test(input), filtered: filteredInput };
  }
  getValue() {
    return this.inputField?.value || "";
  }
  resetValue() {
    if (this.inputField) {
      this.inputField.value = "";
      this.updateTextField();
      this.saveTextFieldValue();
    }
  }
  saveTextFieldValue() {
    const storageKey = `(${rootPath2}/)text_field_value`;
    let storedData = {};
    try {
      storedData = JSON.parse(localStorage.getItem(storageKey) || "{}");
    } catch {
    }
    if (!this.inputField) return;
    const currentValue = this.inputField.value;
    if (this.parentElement?.classList.contains("do_not_save")) return;
    const keyInStoredData = this.classList[0];
    if (typeof keyInStoredData !== "string" || keyInStoredData.trim() === "") {
      return;
    }
    if (currentValue.length === 0) {
      delete storedData[keyInStoredData];
    } else {
      storedData[keyInStoredData] = currentValue;
    }
    try {
      localStorage.setItem(storageKey, JSON.stringify(storedData));
    } catch {
    }
  }
  getTextFieldValue() {
    const storageKey = `(${rootPath2}/)text_field_value`;
    let storedData = {};
    try {
      storedData = JSON.parse(localStorage.getItem(storageKey) || "{}");
    } catch {
    }
    const keyInStoredData = this.classList[0];
    if (typeof keyInStoredData !== "string" || keyInStoredData.trim() === "") {
      if (this.inputField) this.inputField.value = "";
      return;
    }
    if (this.inputField) {
      this.inputField.value = storedData[keyInStoredData] || "";
    }
  }
};
__name(_TextField, "TextField");
var TextField = _TextField;
var rootPath2 = typeof window !== "undefined" ? "/" + (window.location.pathname.split("/").filter(Boolean).length > 0 ? window.location.pathname.split("/").filter(Boolean)[0] : "") : "";
customElements.define("text-field", TextField);
export {
  CustomButton,
  CustomCheckbox,
  CustomDropdown,
  CustomSlider,
  CustomSwitch,
  TextField,
  getMainHandleScroll,
  hideModal,
  ifNavigating,
  launchApplication,
  openLink,
  scrollToTop,
  showModal,
  toTop
};
//# sourceMappingURL=paraore-ui.js.map
