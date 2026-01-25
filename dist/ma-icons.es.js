class u extends HTMLElement {
  static get observedAttributes() {
    return ["name", "size", "weight", "color"];
  }
  connectedCallback() {
    requestAnimationFrame(() => this.render());
  }
  attributeChangedCallback(t, e, r) {
    this.render();
  }
  async render() {
    console.log("rendering icon"), this.name = this.getAttribute("name") ?? "topright", this.color = this.getAttribute("color") ?? "hsl(0deg 0% 0%)", this.size = this.getAttribute("size") ?? "16", this.weight = this.getAttribute("weight") ?? "5", this.innerHTML = (await this.icon(!1))?.outerHTML ?? "error";
  }
  async icon(t) {
    const e = this.name.split("-"), r = t ? e[1] : e[0], n = t ? "32" : this.size, c = t ? "32" : "0", o = (parseFloat(this.weight) * (t ? 2 : 1)).toString(), i = `./icons/${r}.svg`;
    let l = await (await fetch(i)).text();
    const a = new DOMParser().parseFromString(l, "image/svg+xml"), s = a.querySelector("svg");
    if (s)
      return s.setAttribute("x", c), s.setAttribute("y", c), s.setAttribute("width", n), s.setAttribute("height", n), s.setAttribute("fill", "none"), a.querySelectorAll("[stroke]").forEach((h) => h.setAttribute("stroke", this.color)), a.querySelectorAll("[stroke-width]").forEach((h) => h.setAttribute("stroke-width", o)), e[1] && !t && await this.child(s), s;
  }
  async child(t) {
    const e = "http://www.w3.org/2000/svg";
    let r = t.querySelector("defs");
    r || (r = document.createElementNS(e, "defs"), t.prepend(r));
    const n = document.createElementNS(e, "mask"), c = `quarterMask-${Math.random().toString(36).substring(2, 9)}`;
    n.setAttribute("id", c);
    const o = document.createElementNS(e, "rect");
    o.setAttribute("width", "64"), o.setAttribute("height", "64"), o.setAttribute("fill", "white"), n.appendChild(o);
    const i = document.createElementNS(e, "rect");
    i.setAttribute("x", "32"), i.setAttribute("y", "32"), i.setAttribute("width", "32"), i.setAttribute("height", "32"), i.setAttribute("fill", "black"), n.appendChild(i), r.appendChild(n), t.querySelectorAll("path, rect, circle, line, polygon, polyline").forEach((a) => {
      a.setAttribute("mask", `url(#${c})`);
    });
    const l = await this.icon(!0);
    l && t.appendChild(l);
  }
}
customElements.define("ma-icon", u);
