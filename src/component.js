class MaIcon extends HTMLElement {
  static get observedAttributes() {
    return ['name', "altname", 'weight', 'size', 'color'];
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
    const preferredName = this.getAttribute('name');
    const altName = this.getAttribute('altname');
    const weight = this.getAttribute('weight') || '5';
    const size = this.getAttribute('size') || '16';
    const color = this.getAttribute('color') || '#000000';

    if (!name) return;
    
    const name = this.hasError ? altName || preferredName : preferredName;

    let url;
    try {
      url = new URL(`../icons/${name}.svg`, import.meta.url).href;
    } catch {
      url = `/icons/${name}.svg`;
    }

    try {
      const res = await fetch(url);
      const svgText = await res.text();

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
      this.shadowRoot.appendChild(svgEl);
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