class o extends HTMLElement {
  static get observedAttributes() {
    return ["name", "size", "weight", "color"];
  }
  connectedCallback() {
    this.render();
  }
  attributeChangedCallback(t, i, s) {
    this.render();
  }
  async render() {
    console.log("rendering icon"), this.name = this.getAttribute("name") ?? "topright", this.color = this.getAttribute("color") ?? "hsl(0deg 0% 0%)", this.size = this.getAttribute("size") ?? "16", this.weight = this.getAttribute("weight") ?? "5", this.innerHTML = (await this.icon(!1))?.outerHTML ?? "error";
  }
  async icon(t) {
    return "eeee";
  }
  async child(t) {
    const i = "http://www.w3.org/2000/svg";
    let s = t.querySelector("defs");
    s || (s = document.createElementNS(i, "defs"), t.prepend(s));
    const r = document.createElementNS(i, "mask"), c = `quarterMask-${Math.random().toString(36).substring(2, 9)}`;
    r.setAttribute("id", c);
    const n = document.createElementNS(i, "rect");
    n.setAttribute("width", "64"), n.setAttribute("height", "64"), n.setAttribute("fill", "white"), r.appendChild(n);
    const e = document.createElementNS(i, "rect");
    e.setAttribute("x", "32"), e.setAttribute("y", "32"), e.setAttribute("width", "32"), e.setAttribute("height", "32"), e.setAttribute("fill", "black"), r.appendChild(e), s.appendChild(r), t.querySelectorAll("path, rect, circle, line, polygon, polyline").forEach((a) => {
      a.setAttribute("mask", `url(#${c})`);
    });
    const l = await this.icon(!0);
    l && t.appendChild(l);
  }
}
customElements.define("ma-icon", o);
