if (typeof window < "u") {
  class u extends HTMLElement {
    id = "topright";
    size = "16";
    weight = "5";
    color = "hsl(0deg 0% 0%)";
    static get observedAttributes() {
      return ["id", "size", "weight", "color"];
    }
    connectedCallback() {
      this.render();
    }
    attributeChangedCallback() {
      this.render();
    }
    async render() {
      this.id = this.getAttribute("id") ?? "topright", this.color = this.getAttribute("color") ?? "hsl(0deg 0% 0%)", this.innerHTML = "test";
    }
    async icon(t) {
      const i = this.id.split("-"), c = t ? i[1] : i[0], r = t ? "32" : this.size, o = t ? "32" : "0", s = (parseFloat(this.weight) * (t ? 2 : 1)).toString(), n = new URL((/* @__PURE__ */ Object.assign({}))[`./icons/${c}.svg`], import.meta.url).href;
      let l = await (await fetch(n)).text();
      const a = new DOMParser().parseFromString(l, "image/svg+xml"), e = a.querySelector("svg");
      if (e)
        return e.setAttribute("x", o), e.setAttribute("y", o), e.setAttribute("width", r), e.setAttribute("height", r), e.setAttribute("fill", "none"), a.querySelectorAll("[stroke]").forEach((h) => h.setAttribute("stroke", this.color)), a.querySelectorAll("[stroke-width]").forEach((h) => h.setAttribute("stroke-width", s)), i[1] && !t && await this.child(e), console.log(e.outerHTML), e;
    }
    async child(t) {
      const i = "http://www.w3.org/2000/svg";
      let c = t.querySelector("defs");
      c || (c = document.createElementNS(i, "defs"), t.prepend(c));
      const r = document.createElementNS(i, "mask");
      r.setAttribute("id", "quarterMask");
      const o = document.createElementNS(i, "rect");
      o.setAttribute("width", "64"), o.setAttribute("height", "64"), o.setAttribute("fill", "white"), r.appendChild(o);
      const s = document.createElementNS(i, "rect");
      s.setAttribute("x", "32"), s.setAttribute("y", "32"), s.setAttribute("width", "32"), s.setAttribute("height", "32"), s.setAttribute("fill", "black"), r.appendChild(s), c.appendChild(r), t.querySelectorAll("path, rect, circle, line, polygon, polyline").forEach((l) => {
        l.setAttribute("mask", "url(#quarterMask)");
      });
      const n = await this.icon(!0);
      n && t.appendChild(n);
    }
  }
  customElements.define("ma-icon", u);
}
