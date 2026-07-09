import { ifJsAvailableAndLoaded } from "./helper/ifJsAvailableAndLoaded.js";

class ActiveNav extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    setActiveItem(this);
  }
}

ifJsAvailableAndLoaded(
  () => customElements.define("active-nav", ActiveNav),
  ["querySelector", "addEventListener", "customElements"],
);

function setActiveItem(nav) {
  const navItems = nav.querySelectorAll("a");
  const url = window.location.href;

  for (var i = 0; i < navItems.length; i++) {
    const itemText = navItems.item(i).textContent.toLowerCase();

    if (url.includes(itemText)) {
      navItems.item(i).classList.add("nav-active");
      navItems.item(i).ariaCurrent = "selection";
    }
  }
}
