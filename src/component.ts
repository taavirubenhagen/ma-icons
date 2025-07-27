import { html, css, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('ma-icon')
export class SimpleGreeting extends LitElement {

  static styles = css`
    svg {
      display: block;
    }
    
    a {
      display: inline-flex;
      align-items: center;
      opacity: inherit;
      color: inherit;
      text-decoration: inherit;
      font-family: inherit;
      font-size: inherit;
    }
    
    .styled {
      transition: opacity 200ms ease-in-out;
      color: hsl(0deg 0% 0% / calc(100% * 3/8));
    }
    
    .styled:hover {
      opacity: 75%;
    }
  `;

  @property() styled = false;
  @property() download = false;
  @property() href?: string;
  @property() leading = false;
  @property() name = "top-right";
  @property() altname = "not-found";
  @property() size = '16';
  @property() weight = '5';
  @property() color = 'hsl(0deg 0% 0%)';

  @state() private svg: string | null = null;

  /*updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);

    if (changedProperties.has('name')) {
      this.modifySvg();
    }
  }*/

  render() {
    const icon = this.svg ? html`<span .innerHTML=${this.modifySvg()}></span>` : html``;
    if (this.href) {
      return html`
        <a ${this.download ? 'download="' + this.download + '"' : ""} href=${this.href} class="${this.styled ? "styled" : ""}">
            ${this.leading ? html`${icon}&thinsp;` : ""}<slot></slot>${this.leading ? "" : html`&thinsp;${icon}`}
        </a>
      `;
    }
    return icon;
  }
  
  async modifySvg() {
    const name = this.download ? "download" : this.name;
    let url;
    try {
      url = new URL(`../icons/${name}.svg`, import.meta.url).href;
    } catch {
      url = `/icons/${name}.svg`;
    }
    let altUrl;
    try {
      altUrl = new URL(`../icons/${this.altname}.svg`, import.meta.url).href;
    } catch {
      altUrl = `/icons/${this.altname}.svg`;
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
    const doc = ( new DOMParser() ).parseFromString(svgText, 'image/svg+xml');
    const svgEl = doc.querySelector('svg');
    if (!svgEl) return "error";

    svgEl?.setAttribute('width', this.size);
    svgEl?.setAttribute('height', this.size);
    svgEl?.setAttribute('fill', 'none');
    doc.querySelectorAll('[stroke]').forEach(el => el.setAttribute('stroke', this.styled ? "hsl(0deg 0% 0% / calc(100% * 3/8))" : this.color));
    doc.querySelectorAll('[stroke-width]').forEach(el => el.setAttribute('stroke-width', this.weight));

    this.svg = svgEl?.outerHTML;
    return this.svg;
  }
}