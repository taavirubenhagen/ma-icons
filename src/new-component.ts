import { html, css, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { icon } from './icon';

@customElement('ma')
export class MaIcon extends LitElement {
  static styles = css`
    svg {
        display: block;
    }
  `;

  @property() id = "top-right";
  @state() private svg: string | undefined = undefined;

  updated(changed: Map<string | number | symbol, unknown>) {
    super.updated(changed);
    if (changed.has('id')) (async () => this.svg = (await icon(this.id, false)))();
  }

  render() {
    return this.svg ? html`<span .innerHTML=${this.svg}></span>` : html``;
  }
}