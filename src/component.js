class MaIcon extends HTMLElement {
  static get observedAttributes() {
    return ['name', 'altname', 'weight', 'size', 'color', "leading", "trailing"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  async render() {
    const leading = this.getAttribute('leading') || false;
    const trailing = this.getAttribute('trailing') || false;
    const name = this.getAttribute('name');
    const altName = this.getAttribute('altname') || "undefined";
    const weight = this.getAttribute('weight') || '5';
    const size = this.getAttribute('size') || '16';
    const color = this.getAttribute('color') || '#000000';

    if (!name) return;

    let url;
    try {
      url = new URL(`../icons/${name}.svg`, import.meta.url).href;
    } catch {
      url = `/icons/${name}.svg`;
    }
    let altUrl;
    try {
      altUrl = new URL(`../icons/${altName}.svg`, import.meta.url).href;
    } catch {
      altUrl = `/icons/${altName}.svg`;
    }
    let res;
    let svgText;
    try {
      res = await fetch(url);
      svgText = await res.text();
    } catch {
      res = await fetch(altUrl);
      svgText = await res.text();
    }

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgText, 'image/svg+xml');
      const svgEl = doc.querySelector('svg');

      svgEl.setAttribute('width', size);
      svgEl.setAttribute('height', size);
      svgEl.setAttribute('fill', 'none');

      doc.querySelectorAll('[stroke]').forEach(el => el.setAttribute('stroke', color));
      doc.querySelectorAll('[stroke-width]').forEach(el => el.setAttribute('stroke-width', weight));

      this.shadowRoot.innerHTML = `
        <style>
          svg {
            display: block;
          }
        </style>
      `;
      if (leading) {
        const leadingGapElement = parser.parseFromString("&thinsp;");
        this.shadowRoot.appendChild(leadingGapElement);
      }
      this.shadowRoot.appendChild(svgEl);
      if (trailing) {
        const trailingGapElement = parser.parseFromString("&thinsp;");
        this.shadowRoot.appendChild(trailingGapElement);
      }
    } catch (e) {
      console.error(`MaIcon: Failed to load "${name}.svg"`, e);
      this.shadowRoot.innerHTML = '';
    }
  }
}

// ✅ Only define if not already defined
if (!customElements.get('ma-icon')) {
  customElements.define('ma-icon', MaIcon);
}