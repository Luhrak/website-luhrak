class ActiveNav extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    setActiveItem(this);
  }
}

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

// JS availablity check
if (
  "customElements" in window &&
  "querySelector" in document &&
  "addEventListener" in window
) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () =>
      customElements.define("active-nav", ActiveNav),
    );
  } else {
    customElements.define("active-nav", ActiveNav);
  }
}
