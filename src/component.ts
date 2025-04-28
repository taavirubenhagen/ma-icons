import { html, css, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import {styleMap} from 'lit/directives/style-map.js';

@customElement('ma-icon')
export class SimpleGreeting extends LitElement {

  static styles = css`
    svg {
      display: block;
    }
    
    a {
      transition-property: all;
      transition-duration: 200ms;
      display: inline-flex;
      align-items: center;
      opacity: inherit;
      color: inherit;
      text-decoration: inherit;
      font-family: inherit;
      font-size: inherit;
    }
    
    a:hover {
      opacity: 75%;
    }
  `;

  @property() styled = false;
  @property() href?: string;
  @property() leading = false;
  @property() name = "top-right";
  @property() size = '16';
  @property() weight = '5';
  @property() color = 'hsl(0deg 0% 0%)';

  @state() private svg: string | null = null;

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);

    if (changedProperties.has('name')) {
      this.modifySvg();
    }
  }

  render() {const icon = this.svg ? html`<span .innerHTML=${this.svg}></span>` : html``;
    if (this.href != null) {
      const linkStyles = this.styled
      ? {
        color: "hsl(0deg 0% 0% / calc(100% * 3/8))",
      } : {};
      return html`
        <a style=${styleMap(linkStyles)} href=${this.href}>
        ${this.leading ? html`${icon}&thinsp;` : ""}<slot></slot>${this.leading ? "" : html`&thinsp;${icon}`}
        </a>
      `;
    }
    return html`${icon}`;
  }
  
  async modifySvg() {
    const res = await fetch("https://raw.githubusercontent.com/taavirubenhagen/ma-icons/main/icons/" + this.name +".svg");
    const svgText = await res.text();
    const doc = ( new DOMParser() ).parseFromString(svgText, 'image/svg+xml');
    const svgEl = doc.querySelector('svg');
    if (!svgEl) return "";

    svgEl?.setAttribute('width', this.size);
    svgEl?.setAttribute('height', this.size);
    svgEl?.setAttribute('fill', 'none');
    doc.querySelectorAll('[stroke]').forEach(el => el.setAttribute('stroke', this.styled ? "hsl(0deg 0% 0% / calc(100% * 3/8))" : this.color));
    doc.querySelectorAll('[stroke-width]').forEach(el => el.setAttribute('stroke-width', this.weight));

    this.svg = svgEl?.outerHTML;
  }
}