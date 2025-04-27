import {createElement} from "../../../utils/index.js";

export class Tab {
    constructor(label, onClick, isActive=false) {
        this.tab = createElement('button', {
            className: `tab ${isActive ? 'active' : ''}`
        }, label);
        this.tab.addEventListener('click', onClick);
    }

    get element() {
        return this.tab;
    }
}
