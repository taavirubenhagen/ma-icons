class MaIcon extends HTMLElement {
  static get observedAttributes() {
    return ["name", "size", "weight", "color"];
  }

  connectedCallback() {
    requestAnimationFrame(() => this.render());
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.render();
  }

  async render() {
    console.log("rendering icon");
    this.name = this.getAttribute("name") ?? "topright";
    this.color = this.getAttribute("color") ?? "hsl(0deg 0% 0%)";
    this.size = this.getAttribute("size") ?? "16";
    this.weight = this.getAttribute("weight") ?? "5";
    this.style.display = "inline-block";
    this.innerHTML = (await this.icon(false))?.outerHTML ?? "error";
  }

  async icon(isChild) {
    const ids = this.name.split("-");
    const name = isChild ? ids[1] : ids[0];
    const size = isChild ? "32" : this.size;
    const offset = isChild ? "32" : "0";
    const weight = (parseFloat(this.weight) * (isChild ? 2 : 1)).toString();
    const url = new URL(`../icons/${name}.svg`, import.meta.url).href;
    let svgText = await (await fetch(url)).text();
    const doc = new DOMParser().parseFromString(svgText, "image/svg+xml");
    const svgEl = doc.querySelector("svg");
    if (!svgEl) return;
    svgEl.setAttribute("x", offset);
    svgEl.setAttribute("y", offset);
    svgEl.setAttribute("width", size);
    svgEl.setAttribute("height", size);
    svgEl.setAttribute("fill", "none");
    doc
      .querySelectorAll("[stroke]")
      .forEach((e) => e.setAttribute("stroke", this.color));
    doc
      .querySelectorAll("[stroke-width]")
      .forEach((e) => e.setAttribute("stroke-width", weight));
    if (ids[1] && !isChild) await this.child(svgEl);
    return svgEl;
  }

  async child(parent) {
    const ns = "http://www.w3.org/2000/svg";
    let defs = parent.querySelector("defs");
    if (!defs) {
      defs = document.createElementNS(ns, "defs");
      parent.prepend(defs);
    }
    const mask = document.createElementNS(ns, "mask");
    const maskId = `quarterMask-${Math.random().toString(36).substring(2, 9)}`;
    mask.setAttribute("id", maskId);
    const fullRect = document.createElementNS(ns, "rect");
    fullRect.setAttribute("width", "64");
    fullRect.setAttribute("height", "64");
    fullRect.setAttribute("fill", "white");
    mask.appendChild(fullRect);
    const transparentRect = document.createElementNS(ns, "rect");
    transparentRect.setAttribute("x", "32");
    transparentRect.setAttribute("y", "32");
    transparentRect.setAttribute("width", "32");
    transparentRect.setAttribute("height", "32");
    transparentRect.setAttribute("fill", "black");
    mask.appendChild(transparentRect);
    defs.appendChild(mask);
    parent
      .querySelectorAll("path, rect, circle, line, polygon, polyline")
      .forEach((e) => {
        e.setAttribute("mask", `url(#${maskId})`);
      });
    const child = await this.icon(true);
    if (child) parent.appendChild(child);
  }
}

customElements.define("ma-icon", MaIcon);

export {}; // important for ES module side effects
