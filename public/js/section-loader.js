import { ifJsAvailableAndLoaded } from "./helper/ifJsAvailableAndLoaded.js";

class SectionLoader extends HTMLElement {
  constructor() {
    super();
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("fadeOutContent");
            entry.target.classList.add("fadeInContent");
          } else if (!entry.target.classList.contains("fadeInContent")) {
            entry.target.classList.add("fadeOutContent");
          }
        });
      },
      { threshold: 0.2 },
    );
    this.targetList = this.querySelectorAll("section");
  }

  static get observedAttributes() {
    return ["target"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "target") {
      console.log(newValue);
      this.targetList = this.querySelectorAll(newValue);
      console.log(this.targetList);
    }
  }

  connectedCallback() {
    this.setupSections();
  }

  setupSections() {
    this.targetList.forEach((section) => this.observer.observe(section));
  }
}

ifJsAvailableAndLoaded(
  () => customElements.define("section-loader", SectionLoader),
  ["querySelector", "addEventListener", "customElements"],
);
