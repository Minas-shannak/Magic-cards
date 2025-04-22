import { createElement } from '../../../utils/index.js';

export class NavLink {
  constructor(text, href) {
    this.href = href;
    this._link = createElement('a', { href: `#${href}` }, text);
  }

  get element() {
    return this._link;
  }
}
