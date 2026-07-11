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
    this.sections = this.querySelectorAll("section");
  }

  connectedCallback() {
    this.setupSections();
  }

  setupSections() {
    this.sections.forEach((section) => this.observer.observe(section));
  }
}

ifJsAvailableAndLoaded(
  () => customElements.define("section-loader", SectionLoader),
  ["querySelector", "addEventListener", "customElements"],
);
