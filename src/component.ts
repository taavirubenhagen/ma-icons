import { html, css, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('ma-icon')
export class MaIcon extends LitElement {
  static styles = css`
    svg {
        display: block;
    }
  `;

  @property() id = "topright";
  @property() size = '16';
  @property() weight = '5';
  @property() color = 'hsl(0deg 0% 0%)';
  @state() private svg: string | undefined = undefined;

  updated(changed: Map<string | number | symbol, unknown>) {
    super.updated(changed);
    if (changed.has('id')) (async () => this.svg = (await this.icon(false))?.outerHTML)();
  }

  render() {
    return this.svg ? html`<span .innerHTML=${this.svg}></span>` : html``;
  }

  async icon(isChild: boolean) {
    const ids = this.id.split("+");
    const name = isChild ? ids[1] : ids[0];
    const size = isChild ? '32' : this.size;
    const offset = isChild ? "32" : "0";
    const weight = (parseFloat(this.weight) * (isChild ? 2 : 1)).toString()
    const load = async (n: string) => {
      try {
        const u = new URL(`../icons/${n}.svg`, import.meta.url).href; 
        return await (await fetch(u)).text(); 
      } catch { 
        return await (await fetch(`/icons/${n}.svg`)).text(); 
      }
    };
    let svgText = await load(name);
    const doc = new DOMParser().parseFromString(svgText, 'image/svg+xml');
    const svgEl = doc.querySelector('svg');
    if (!svgEl) return;
    svgEl.setAttribute('x', offset);
    svgEl.setAttribute('y', offset);
    svgEl.setAttribute('width', size);
    svgEl.setAttribute('height', size);
    svgEl.setAttribute('fill', 'none');
    doc.querySelectorAll('[stroke]').forEach(e => e.setAttribute('stroke', this.color));
    doc.querySelectorAll('[stroke-width]').forEach(e => e.setAttribute('stroke-width', weight));
    if (ids[1] && !isChild) await this.child(svgEl);
    return svgEl;
  }

  async child(parent: SVGSVGElement) {
    const ns = "http://www.w3.org/2000/svg";
    let defs = parent.querySelector('defs');
    if (!defs) {
      defs = document.createElementNS(ns, 'defs');
      parent.prepend(defs);
    }
    const mask = document.createElementNS(ns, 'mask');
    mask.setAttribute('id', 'quarterMask');
    const fullRect = document.createElementNS(ns, 'rect');
    fullRect.setAttribute('width', "64");
    fullRect.setAttribute('height', "64");
    fullRect.setAttribute('fill', 'white');
    mask.appendChild(fullRect);
    const transparentRect = document.createElementNS(ns, 'rect');
    transparentRect.setAttribute('x', "32");
    transparentRect.setAttribute('y', "32");
    transparentRect.setAttribute('width', "32");
    transparentRect.setAttribute('height', "32");
    transparentRect.setAttribute('fill', 'black');
    mask.appendChild(transparentRect);
    defs.appendChild(mask);
    parent.querySelectorAll('path, rect, circle, line, polygon, polyline').forEach(e => {
      e.setAttribute('mask', 'url(#quarterMask)');
    });
    const child = await this.icon(true);
    if (child) parent.appendChild(child);
  }
}