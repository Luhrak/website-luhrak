import { ifJsAvailableAndLoaded } from "./helper/ifJsAvailableAndLoaded.js";

class HamburgerMenu extends HTMLElement {
  constructor() {
    super();
  }

  // Create the click handler
  async handleEvent(event) {}

  toggleMenu(e) {
    document.querySelector("hamburger-menu")?.classList.toggle("is-hidden");
    const button = e.target;
    const expanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!expanded));
  }

  closeMenu(e) {
    const menu = document.querySelector("hamburger-menu");
    menu.classList.add("is-hidden");
    const button = menu.querySelector("button");
    button.setAttribute("aria-expanded", false);
  }

  // Start listening
  //https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#custom_element_lifecycle_callbacks
  connectedCallback() {
    this.insertAdjacentHTML(
      "afterbegin",
      `<button aria-expanded="false" class="HamburgerMenu-toggle"><span aria-hidden="true">
          <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <rect width="16" height="16" id="icon-bound" fill="none" />
        <path d="M1,9h14V7H1V9z M1,14h14v-2H1V14z M1,2v2h14V2H1z" fill="currentcolor"/>
      </svg></span></button>`,
    );
    const navs = this.querySelectorAll("nav");
    navs.forEach((el) => el.classList.add("HamburgerMenu-overlay"));
    this.classList.add("is-hidden");
    const toggle = this.querySelector("button");
    toggle.addEventListener("click", this.toggleMenu);

    document.addEventListener("keyup", (e) => {
      if (e.key === "Escape") {
        this.closeMenu();
      }
    });
  }
}

ifJsAvailableAndLoaded(
  () => customElements.define("hamburger-menu", HamburgerMenu),
  ["querySelector", "addEventListener", "customElements"],
);
