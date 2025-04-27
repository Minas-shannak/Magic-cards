import { createElement } from "../../../utils/index.js";

export class TabContainer {
    constructor(tabs) {
        this._tabs = tabs
        this.container = createElement('div', { className: 'tab-container' });
        this._tabs.forEach(tab => this.container.appendChild(tab.element));
    }

    get tabs() {
        return this._tabs
    }

    get element() {
        return this.container;
    }
}